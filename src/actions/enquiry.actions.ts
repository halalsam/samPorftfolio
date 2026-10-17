"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { z } from "zod";
import { NEEDS, NEED_OPTIONS } from "@/lib/enquiry";
import { SITE_URL } from "@/lib/site";

const needLabel = (need: string) => NEED_OPTIONS.find((o) => o.value === need)?.label ?? need;

// Anything quicker than this, from the form mounting to it being sent, is a
// script rather than a person typing.
const MIN_FILL_MS = 3000;

const enquirySchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(100, "That name is a bit long"),
  email: z.string().trim().email("Enter a valid email"),
  need: z.enum(NEEDS, { message: "Pick what you need" }),
  budget: z.string().trim().max(80, "Keep the budget short").optional(),
  message: z
    .string()
    .trim()
    .min(10, "Tell me a bit more about it")
    .max(5000, "That's a lot. Keep it under 5000 characters"),
});

type EnquiryFields = z.infer<typeof enquirySchema>;

export type EnquiryFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<keyof EnquiryFields, string>>;
  // Echoed back on error so the form can refill itself after React resets it.
  values?: Partial<Record<keyof EnquiryFields, string>>;
};

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// Keep visitor text on one line where it lands in a header.
const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

function ownerEmail(data: EnquiryFields, pageUrl: string, sentAt: Date) {
  const rows: [string, string][] = [
    ["Name", data.name],
    ["Email", data.email],
    ["Needs", needLabel(data.need)],
    ["Budget", data.budget || "Not given"],
    ["Page", pageUrl],
    ["Sent", `${sentAt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST (${sentAt.toISOString()})`],
  ];

  const text = [...rows.map(([k, v]) => `${k}: ${v}`), "", "Message:", data.message].join("\n");

  const html = `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.5;color:#111">
<table cellpadding="4" style="border-collapse:collapse">${rows
    .map(([k, v]) => `<tr><td style="color:#666;vertical-align:top">${k}</td><td>${escapeHtml(v)}</td></tr>`)
    .join("")}</table>
<p style="color:#666;margin:16px 0 4px">Message</p>
<p style="white-space:pre-wrap;margin:0">${escapeHtml(data.message)}</p>
</div>`;

  return { text, html };
}

function autoReply(data: EnquiryFields) {
  const text = [
    `Hi ${oneLine(data.name)},`,
    "",
    "Thanks for getting in touch. Your message reached me and I'll reply to this address soon.",
    "",
    "For reference, you wrote:",
    "",
    data.message,
    "",
    "Sam",
  ].join("\n");

  const html = `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.5;color:#111">
<p>Hi ${escapeHtml(oneLine(data.name))},</p>
<p>Thanks for getting in touch. Your message reached me and I'll reply to this address soon.</p>
<p style="color:#666;margin-bottom:4px">For reference, you wrote:</p>
<p style="white-space:pre-wrap;margin-top:0;color:#444">${escapeHtml(data.message)}</p>
<p>Sam</p>
</div>`;

  return { text, html };
}

export async function submitEnquiry(
  _prevState: EnquiryFormState,
  formData: FormData
): Promise<EnquiryFormState> {
  // Bots: a filled honeypot or an instant submit gets a quiet "success" and
  // no email, so there's nothing to learn from the response.
  const honeypot = formData.get("contact_me_by_fax");
  const startedAt = Number(formData.get("started_at"));
  if (
    (typeof honeypot === "string" && honeypot.length > 0) ||
    !Number.isFinite(startedAt) ||
    startedAt <= 0 ||
    Date.now() - startedAt < MIN_FILL_MS
  ) {
    return { status: "success" };
  }

  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    need: String(formData.get("need") ?? ""),
    budget: String(formData.get("budget") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  const parsed = enquirySchema.safeParse({ ...raw, budget: raw.budget || undefined });

  if (!parsed.success) {
    const fieldErrors: EnquiryFormState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof EnquiryFields;
      fieldErrors[key] ??= issue.message;
    }
    return { status: "error", fieldErrors, values: raw };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Enquiry not sent: RESEND_API_KEY is not set.");
    return {
      status: "error",
      message: "The form isn't working right now. Please email me directly instead.",
      values: raw,
    };
  }

  const data = parsed.data;
  const to = process.env.CONTACT_TO_EMAIL || "sam@samcode.in";
  const from = process.env.CONTACT_FROM_EMAIL || "samcode.in <hello@samcode.in>";
  const pageUrl = (await headers()).get("referer") || `${SITE_URL}/contact`;
  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: data.email,
      subject: `New enquiry from ${oneLine(data.name)}`,
      ...ownerEmail(data, pageUrl, new Date()),
    });
    if (error) throw error;
  } catch (err) {
    console.error("Enquiry email failed:", err);
    return {
      status: "error",
      message: "Something went wrong sending that. Please try again, or email me directly.",
      values: raw,
    };
  }

  // The confirmation is a courtesy: if it fails, the enquiry still arrived.
  try {
    const { error } = await resend.emails.send({
      from,
      to: data.email,
      replyTo: to,
      subject: "Thanks for your message",
      ...autoReply(data),
    });
    if (error) console.error("Enquiry auto-reply failed:", error);
  } catch (err) {
    console.error("Enquiry auto-reply failed:", err);
  }

  return { status: "success" };
}
