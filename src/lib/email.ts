import { Resend } from "resend";

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
};

let resendClient: Resend | null = null;

function getResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function layout(title: string, body: string): string {
  return `
  <div style="font-family:Arial,sans-serif;background:#f6f7f9;padding:32px 12px;color:#111827;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;padding:32px;border:1px solid #e5e7eb;">
      <h1 style="font-size:22px;margin:0 0 16px;">${escapeHtml(title)}</h1>
      ${body}
      <hr style="border:0;border-top:1px solid #e5e7eb;margin:28px 0 16px;" />
      <p style="font-size:12px;color:#6b7280;margin:0;">
        If you did not request this, you can safely ignore this email.
      </p>
      <p style="font-size:12px;color:#6b7280;margin:8px 0 0;">MentorLagbe</p>
    </div>
  </div>`;
}

export async function sendEmail(input: SendEmailInput): Promise<void> {
  const client = getResend();

  // Email is an auxiliary channel: a missing key or provider outage must never
  // break sign-up or password reset endpoints. Configure RESEND_API_KEY to enable.
  if (!client) {
    console.warn("[email] RESEND_API_KEY is not set; skipping email send");
    return;
  }

  const from = process.env.EMAIL_FROM || "MentorLagbe <onboarding@resend.dev>";

  try {
    const { error } = await client.emails.send({
      from,
      to: input.to,
      subject: input.subject,
      html: input.html,
    });

    if (error) {
      console.error("[email] Resend rejected the message:", error.message);
    }
  } catch (error) {
    console.error(
      "[email] Failed to send email:",
      error instanceof Error ? error.message : error,
    );
  }
}

export function passwordResetEmail(name: string, url: string): string {
  return layout(
    "Reset your MentorLagbe password",
    `<p style="font-size:15px;line-height:1.6;color:#374151;">
      Hi ${escapeHtml(name || "there")}, we received a request to reset your password.
    </p>
    <p style="text-align:center;margin:28px 0;">
      <a href="${escapeHtml(url)}" style="background:#4f46e5;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:10px;font-weight:600;display:inline-block;">
        Reset password
      </a>
    </p>
    <p style="font-size:13px;color:#6b7280;">This link expires in 15 minutes and can be used once.</p>`,
  );
}

export function verificationEmail(name: string, url: string): string {
  return layout(
    "Verify your MentorLagbe email",
    `<p style="font-size:15px;line-height:1.6;color:#374151;">
      Hi ${escapeHtml(name || "there")}, please confirm your email address.
    </p>
    <p style="text-align:center;margin:28px 0;">
      <a href="${escapeHtml(url)}" style="background:#4f46e5;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:10px;font-weight:600;display:inline-block;">
        Verify email
      </a>
    </p>
    <p style="font-size:13px;color:#6b7280;">This link expires in 15 minutes.</p>`,
  );
}
