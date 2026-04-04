import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const BREVO_API_URL = "https://api.brevo.com/v3";
const BREVO_LIST_ID = 27;
const NOTIFICATION_EMAIL = "jj@gpghouston.com";

async function addBrevoContact(apiKey: string, contact: { name: string; email: string; phone: string | null }) {
  try {
    const res = await fetch(`${BREVO_API_URL}/contacts`, {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: contact.email,
        attributes: {
          FIRSTNAME: contact.name.split(" ")[0],
          LASTNAME: contact.name.split(" ").slice(1).join(" ") || "",
          SMS: contact.phone || "",
        },
        listIds: [BREVO_LIST_ID],
        updateEnabled: true,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`Brevo add contact failed [${res.status}]: ${body}`);
    }
  } catch (err) {
    console.error("Brevo add contact error:", err);
  }
}

async function sendBrevoNotification(
  apiKey: string,
  submission: { name: string; email: string; phone: string | null; subject: string; message: string }
) {
  try {
    const res = await fetch(`${BREVO_API_URL}/smtp/email`, {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sender: { name: "SAF Website", email: NOTIFICATION_EMAIL },
        to: [{ email: NOTIFICATION_EMAIL, name: "SAF Admin" }],
        subject: `New Contact Form: ${submission.subject}`,
        htmlContent: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${submission.name}</p>
          <p><strong>Email:</strong> ${submission.email}</p>
          <p><strong>Phone:</strong> ${submission.phone || "Not provided"}</p>
          <p><strong>Subject:</strong> ${submission.subject}</p>
          <p><strong>Message:</strong></p>
          <p>${submission.message.replace(/\n/g, "<br>")}</p>
        `,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`Brevo send email failed [${res.status}]: ${body}`);
    }
  } catch (err) {
    console.error("Brevo send email error:", err);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, subject, message } = await req.json();

    // Validate required fields
    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return new Response(
        JSON.stringify({ error: "Name, email, subject, and message are required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return new Response(
        JSON.stringify({ error: "Invalid email address." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Enforce length limits
    const sanitized = {
      name: name.trim().slice(0, 200),
      email: email.trim().slice(0, 255),
      phone: phone?.trim().slice(0, 30) || null,
      subject: subject.trim().slice(0, 300),
      message: message.trim().slice(0, 5000),
    };

    // Get client IP for rate limiting
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Rate limit: max 5 submissions per IP per hour
    const { data: allowed } = await supabase.rpc("check_contact_rate_limit", {
      client_ip: clientIp,
    });

    if (!allowed) {
      return new Response(
        JSON.stringify({ error: "Too many submissions. Please try again later." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Save to database first (always persists even if Brevo fails)
    const { error } = await supabase.from("contact_submissions").insert({
      ...sanitized,
      metadata: { ip: clientIp },
    });

    if (error) throw error;

    // Brevo integration (non-blocking - failures don't affect the user response)
    const brevoApiKey = Deno.env.get("BREVO_API_KEY");
    if (brevoApiKey) {
      await Promise.allSettled([
        addBrevoContact(brevoApiKey, sanitized),
        sendBrevoNotification(brevoApiKey, sanitized),
      ]);
    } else {
      console.warn("BREVO_API_KEY not configured, skipping Brevo integration");
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Contact form error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to send message. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
