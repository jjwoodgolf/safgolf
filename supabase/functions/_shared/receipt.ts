import { ORG } from "./saf.ts";
import { ProviderAmbiguous, ProviderRejected, receiptTag } from "./outbox.ts";

export interface ReceiptData {
  receipt_number: string;
  kind: "one_time" | "monthly_invoice" | "test";
  donor_name: string | null;
  donor_email: string;
  amount_cents: number;
  currency: string;
  paid_at: string; // ISO
  manage_url?: string | null;
}

export function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

const money = (c: number, cur: string) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: cur.toUpperCase() }).format(c / 100);
const date = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "America/Chicago" });

export function renderReceipt(r: ReceiptData) {
  const isTest = r.kind === "test";
  const name = (r.donor_name || "").trim() || "Donor";
  const amount = money(r.amount_cents, r.currency);
  const typeLine = isTest
    ? "TEST — NOT A DONATION"
    : r.kind === "monthly_invoice"
      ? "Monthly recurring gift — this receipt covers this single payment only"
      : "One-time gift";
  const subject = isTest
    ? `[TEST — NOT A DONATION] Receipt template preview ${r.receipt_number}`
    : `Your donation receipt ${r.receipt_number} — ${ORG.brand}`;

  const rows: [string, string][] = [
    ["Receipt number", r.receipt_number],
    ["Donor", name],
    ["Date received", date(r.paid_at)],
    ["Amount received", amount + (isTest ? " (TEST — no payment)" : "")],
    ["Gift type", typeLine],
    ["Organization", ORG.legalName],
    ["EIN", ORG.ein],
  ];

  const statement = isTest
    ? "THIS IS A TEST MESSAGE. No payment was made and this is NOT a tax receipt."
    : "No goods or services were provided in exchange for this contribution.";

  const text = [
    isTest ? "*** TEST — NOT A DONATION — $0.00 ***\n" : "",
    `${ORG.brand}`,
    `${ORG.legalName} · 501(c)(3) nonprofit · EIN ${ORG.ein}`,
    "",
    `Dear ${name},`,
    "",
    isTest ? "This is a preview of the donation receipt template." : "Thank you for your contribution. Please keep this receipt for your tax records.",
    "",
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    statement,
    "Contributions are tax-deductible to the extent permitted by law.",
    "",
    r.manage_url ? `Manage or cancel your monthly gift: ${r.manage_url}\n` : "",
    `Questions: ${ORG.replyTo} · ${ORG.phone}`,
    ORG.site,
  ].join("\n");

  const e = escapeHtml;
  const html = `<!doctype html><html><body style="margin:0;background:#f6f5f3;font-family:Helvetica,Arial,sans-serif;color:#222">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border:1px solid #e3e0dc">
${isTest ? `<tr><td style="background:#222;color:#fff;padding:12px 32px;font-weight:bold;letter-spacing:1px">TEST — NOT A DONATION — $0.00</td></tr>` : ""}
<tr><td style="padding:32px 32px 8px;border-top:4px solid #690000">
<div style="font-family:Georgia,serif;font-size:24px;color:#690000">${e(ORG.brand)}</div>
<div style="font-size:13px;color:#666;margin-top:4px">${e(ORG.legalName)} · 501(c)(3) nonprofit · EIN ${e(ORG.ein)}</div>
</td></tr>
<tr><td style="padding:16px 32px;font-size:15px;line-height:1.6">
<p>Dear ${e(name)},</p>
<p>${isTest ? "This is a preview of the donation receipt template." : "Thank you for your contribution. Please keep this receipt for your tax records."}</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:16px 0;font-size:14px">
${rows.map(([k, v]) => `<tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#666;width:42%">${e(k)}</td><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:bold">${e(v)}</td></tr>`).join("")}
</table>
<p style="font-weight:bold">${e(statement)}</p>
<p>Contributions are tax-deductible to the extent permitted by law.</p>
${r.manage_url ? `<p><a href="${e(r.manage_url)}" style="color:#690000">Manage or cancel your monthly gift</a></p>` : ""}
</td></tr>
<tr><td style="padding:16px 32px 32px;font-size:12px;color:#777">Questions: ${e(ORG.replyTo)} · ${e(ORG.phone)}<br>${e(ORG.site)}</td></tr>
</table></td></tr></table></body></html>`;

  return { subject, text, html };
}

const BREVO = "https://api.brevo.com/v3";

/**
 * Sends via Brevo with the persisted receipt UUID as idempotencyKey and a unique per-receipt tag.
 * 4xx (incl. 429) => ProviderRejected (definitely not accepted). Network/timeout/5xx/odd 2xx => ProviderAmbiguous.
 */
export async function sendReceiptEmail(r: ReceiptData & { id?: string }, apiKey = Deno.env.get("BREVO_API_KEY")) {
  if (!apiKey) throw new ProviderRejected("BREVO_API_KEY is not configured");
  const { subject, text, html } = renderReceipt(r);
  const tags = [r.kind === "test" ? "receipt-test" : "donation-receipt"];
  if (r.id) tags.push(receiptTag(r.id));
  let res: Response;
  try {
    res = await fetch(`${BREVO}/smtp/email`, {
      method: "POST",
      signal: AbortSignal.timeout(15_000),
      headers: { "api-key": apiKey, "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        sender: { name: ORG.brand, email: ORG.senderEmail },
        replyTo: { email: ORG.replyTo, name: ORG.brand },
        to: [{ email: r.donor_email, name: r.donor_name || undefined }],
        subject,
        htmlContent: html,
        textContent: text,
        tags,
        ...(r.id ? { headers: { idempotencyKey: r.id } } : {}),
      }),
    });
  } catch (e) {
    throw new ProviderAmbiguous(`Brevo request did not complete: ${e instanceof Error ? e.message : e}`);
  }
  const body = await res.text().catch(() => "");
  if (res.status >= 400 && res.status < 500) throw new ProviderRejected(`Brevo [${res.status}]: ${body.slice(0, 500)}`);
  if (!res.ok) throw new ProviderAmbiguous(`Brevo [${res.status}]: ${body.slice(0, 500)}`);
  let messageId: string | null = null;
  try { messageId = JSON.parse(body).messageId ?? null; } catch { /* ignore */ }
  if (!messageId) throw new ProviderAmbiguous(`Brevo accepted without messageId: ${body.slice(0, 200)}`);
  return { messageId };
}

/** Reconciliation: finds an accepted ("requests") event carrying this receipt's unique tag. */
export async function findBrevoMessage(id: string, email: string, apiKey = Deno.env.get("BREVO_API_KEY")): Promise<string | null> {
  if (!apiKey) throw new Error("BREVO_API_KEY is not configured");
  const q = new URLSearchParams({ email, tags: JSON.stringify([receiptTag(id)]), event: "requests", days: "30", limit: "10" });
  const res = await fetch(`${BREVO}/smtp/statistics/events?${q}`, {
    headers: { "api-key": apiKey, Accept: "application/json" }, signal: AbortSignal.timeout(15_000),
  });
  const body = await res.text();
  if (!res.ok) throw new Error(`Brevo events [${res.status}]: ${body.slice(0, 300)}`);
  const events = (JSON.parse(body || "{}").events ?? []) as Array<{ messageId?: string; tag?: string; tags?: string[] }>;
  const hit = events.find((e) => (e.tags ?? [e.tag]).includes(receiptTag(id)) && e.messageId);
  return hit?.messageId ?? null;
}
