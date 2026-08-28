import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const BREVO_API_URL = "https://api.brevo.com/v3";
const NOTIFICATION_EMAIL = "jj@gpghouston.com";

const payloadSchema = z.object({}).passthrough();

const bodySchema = z.object({
  program: z.enum(["junior_golf", "veteran", "scholarship"]),
  applicant_name: z.string().min(1).max(200),
  applicant_email: z.string().email().max(320),
  applicant_phone: z.string().max(50).optional().default(""),
  payload: payloadSchema,
});

async function sendBrevoEmail(apiKey: string, args: { to: string; name: string; subject: string; html: string }) {
  try {
    const res = await fetch(`${BREVO_API_URL}/smtp/email`, {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sender: { name: "Student Athlete Foundation", email: NOTIFICATION_EMAIL },
        to: [{ email: args.to, name: args.name }],
        subject: args.subject,
        htmlContent: args.html,
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error(`Brevo email failed [${res.status}]: ${text}`);
    }
  } catch (err) {
    console.error("Brevo email error:", err);
  }
}

function formatPayload(payload: Record<string, unknown>) {
  return Object.entries(payload)
    .map(([k, v]) => `<li><strong>${k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}:</strong> ${String(v).replace(/\n/g, "<br>")}</li>`)
    .join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const parsed = bodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten().fieldErrors }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = parsed.data;

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    const authHeader = req.headers.get("authorization") || "";
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
      global: { headers: authHeader ? { Authorization: authHeader } : undefined },
    });

    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser();
    if (userError || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { error } = await supabaseAdmin.from("program_applications").insert({
      program: body.program,
      applicant_user_id: userData.user.id,
      applicant_name: body.applicant_name,
      applicant_email: body.applicant_email,
      applicant_phone: body.applicant_phone || null,
      payload: body.payload,
      status: "submitted",
    });

    if (error) throw error;

    const brevoApiKey = Deno.env.get("BREVO_API_KEY");
    if (brevoApiKey) {
      const programTitle =
        body.program === "scholarship"
          ? "Scholarship & Mentorship"
          : body.program === "veteran"
          ? "Veterans Clinic"
          : "Junior Golf Program";

      await Promise.allSettled([
        sendBrevoEmail(brevoApiKey, {
          to: body.applicant_email,
          name: body.applicant_name,
          subject: `SAF Application Received — ${programTitle}`,
          html: `
            <p>Hi ${body.applicant_name.split(" ")[0]},</p>
            <p>We have received your application for the <strong>${programTitle}</strong> program. A member of our team will review it and be in touch within 2-3 business days.</p>
            <p>Thank you for being part of the Student Athlete Foundation.</p>
            <p>— SAF Team</p>
          `,
        }),
        sendBrevoEmail(brevoApiKey, {
          to: NOTIFICATION_EMAIL,
          name: "SAF Admin",
          subject: `New ${programTitle} Application`,
          html: `
            <h2>New Application Submission</h2>
            <p><strong>Program:</strong> ${programTitle}</p>
            <p><strong>Name:</strong> ${body.applicant_name}</p>
            <p><strong>Email:</strong> ${body.applicant_email}</p>
            <p><strong>Phone:</strong> ${body.applicant_phone || "Not provided"}</p>
            <ul>${formatPayload(body.payload)}</ul>
          `,
        }),
      ]);
    } else {
      console.warn("BREVO_API_KEY not configured, skipping application emails");
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[submit-application]", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
