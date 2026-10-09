// ONE-OFF owner invitation. Token-gated by the service-only worker token; deleted after use.
// Never returns or logs the invitation link.
import { createClient } from "npm:@supabase/supabase-js@2";
import { ORG } from "../_shared/saf.ts";

const OWNER = "jj@gpghouston.com";
const REDIRECT = "https://safgolf.online/set-password";

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

Deno.serve(async (req) => {
  const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { "Content-Type": "application/json" } });
  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: cfg } = await db.from("app_private_config").select("value").eq("key", "receipt_worker_token").maybeSingle();
  const tok = req.headers.get("x-worker-token") ?? "";
  if (!cfg?.value || !safeEqual(tok, cfg.value)) return json({ error: "unauthorized" }, 401);

  // Reuse existing account if present; otherwise create via invite link.
  let userId: string | null = null;
  const { data: list } = await db.auth.admin.listUsers({ page: 1, perPage: 200 });
  const existing = list?.users.find((u) => u.email?.toLowerCase() === OWNER);
  let link: string;
  if (existing) {
    userId = existing.id;
    const { data, error } = await db.auth.admin.generateLink({ type: "recovery", email: OWNER, options: { redirectTo: REDIRECT } });
    if (error) return json({ step: "generateLink", error: error.message }, 500);
    link = data.properties.action_link;
  } else {
    const { data, error } = await db.auth.admin.generateLink({ type: "invite", email: OWNER, options: { redirectTo: REDIRECT } });
    if (error) return json({ step: "generateLink", error: error.message }, 500);
    link = data.properties.action_link;
    userId = data.user.id;
  }

  const { error: roleErr } = await db.from("user_roles").upsert({ user_id: userId, role: "admin" }, { onConflict: "user_id,role", ignoreDuplicates: true });
  if (roleErr) return json({ step: "role", user_id: userId, error: roleErr.message }, 500);

  const html = `<div style="font-family:Arial,sans-serif;color:#222;max-width:560px">
<h2 style="font-family:Georgia,serif;color:#690000">Your SAF staff dashboard access</h2>
<p>JJ, you have been invited as the administrator of the ${esc(ORG.brand)} donation dashboard.</p>
<p>Open the link below, choose your own password, and you will be taken to the donations dashboard.</p>
<p><a href="${esc(link)}" style="background:#690000;color:#fff;padding:12px 20px;text-decoration:none;display:inline-block">Accept invitation and choose password</a></p>
<p style="font-size:13px;color:#555">This link can be used once and expires (default: 24 hours). If you did not expect this, ignore this email. Afterwards, sign in at https://safgolf.online/login.</p></div>`;
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": Deno.env.get("BREVO_API_KEY")!, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      sender: { name: ORG.brand, email: ORG.senderEmail },
      to: [{ email: OWNER, name: "JJ Wood" }],
      subject: "Your SAF donation dashboard invitation",
      htmlContent: html,
      tags: ["owner-invite"],
    }),
  });
  const body = await res.json().catch(() => ({}));
  return json({ user_id: userId, reused: !!existing, role: "admin", brevo_status: res.status, message_id: body.messageId ?? null, brevo_error: res.ok ? null : body });
});
