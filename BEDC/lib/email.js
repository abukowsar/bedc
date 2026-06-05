import nodemailer from "nodemailer";

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
}

export function createPasswordSetupLink(token) {
  return `${getBaseUrl()}/set-password?token=${encodeURIComponent(token)}`;
}

export async function sendPasswordSetupEmail({ to, studentName, setupLink }) {
  if (!process.env.EMAIL_FROM || !process.env.EMAIL_PASS) {
    throw new Error("EMAIL_FROM and EMAIL_PASS must be set to send setup emails.");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_FROM.trim(),
      pass: process.env.EMAIL_PASS.trim(),
    },
  });

  await transporter.sendMail({
    from: `"One Student One Skills" <${process.env.EMAIL_FROM.trim()}>`,
    to,
    subject: "Set your One Student One Skills password",
    text: `Hello ${studentName},\n\nPlease set your password using this link:\n${setupLink}\n\nThis link will expire in 24 hours.\n\nOne Student One Skills Program`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
        <h2>Set your One Student One Skills password</h2>
        <p>Hello ${studentName},</p>
        <p>Please click the button below to set your password. This link will expire in 24 hours.</p>
        <p><a href="${setupLink}" style="display:inline-block;background:#2563eb;color:#fff;padding:12px 18px;border-radius:999px;text-decoration:none;font-weight:700">Set password</a></p>
        <p>If the button does not work, copy this link:</p>
        <p>${setupLink}</p>
      </div>
    `,
  });
}
