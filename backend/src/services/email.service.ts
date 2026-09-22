import { Resend } from 'resend';
import { config } from '../config/env';
import { logger } from '../utils/logger';

// ─── Resend Client ────────────────────────────────────────────────────────
const resend = new Resend(config.RESEND_API_KEY);
const PRIMARY_FROM = `${config.RESEND_FROM_NAME} <${config.RESEND_FROM_EMAIL}>`;
const FALLBACK_FROM = `${config.RESEND_FROM_NAME} <onboarding@resend.dev>`;

// ─── Types ────────────────────────────────────────────────────────────────
interface EmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

/**
 * Resilient Resend dispatch with automatic fallback for unverified custom domains
 */
async function sendViaResend(options: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
  bcc?: string[];
}): Promise<EmailResult> {
  const primaryFrom = config.RESEND_FROM_EMAIL.includes('onboarding@resend.dev')
    ? FALLBACK_FROM
    : PRIMARY_FROM;

  let result = await resend.emails.send({
    from: primaryFrom,
    to: options.to,
    subject: options.subject,
    html: options.html,
    replyTo: options.replyTo,
    bcc: options.bcc,
  });

  // If primary sender failed due to unverified domain, fallback to onboarding@resend.dev
  if (result.error && (result.error.message?.includes('not verified') || result.error.message?.includes('domain'))) {
    logger.warn(`Sender domain not verified on Resend (${primaryFrom}). Retrying via verified sandbox: ${FALLBACK_FROM}`);
    result = await resend.emails.send({
      from: FALLBACK_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo,
      bcc: options.bcc,
    });
  }

  if (result.error) {
    let friendlyError = result.error.message || 'Unknown email service error';
    if (friendlyError.includes('testing emails to your own email address')) {
      friendlyError = 'Resend sandbox restricted: On this free test plan without a verified domain, emails can only be delivered to the registered owner (manojkunwar242@gmail.com). Please test with that email or verify highschoolyouthclub.org in resend.com/domains.';
    } else if (friendlyError.includes('domain is not verified')) {
      friendlyError = 'The sending domain is not yet verified in Resend. Please add and verify DNS records on resend.com/domains.';
    }
    logger.error('Resend delivery failure:', { error: friendlyError, recipient: options.to });
    return { success: false, error: friendlyError };
  }

  return { success: true, id: result.data?.id };
}

// ─── sendWelcomeEmail ─────────────────────────────────────────────────────
export async function sendWelcomeEmail(to: string, name: string): Promise<EmailResult> {
  try {
    const result = await sendViaResend({
      to,
      subject: 'Welcome to High School Youth Club! 🎉',
      html: buildWelcomeHtml(name),
    });

    if (result.success) {
      logger.info(`Welcome email sent to ${to}`, { id: result.id });
    }
    return result;
  } catch (err) {
    logger.error('Email service error (welcome):', err);
    return { success: false, error: (err as Error).message };
  }
}

// ─── sendPasswordResetEmail ───────────────────────────────────────────────
export async function sendPasswordResetEmail(to: string, name: string, resetLink: string): Promise<EmailResult> {
  try {
    const result = await sendViaResend({
      to,
      subject: 'Reset Your High School Youth Club Password',
      html: buildPasswordResetHtml(name, resetLink),
    });
    return result;
  } catch (err) {
    logger.error('Email service error (reset):', err);
    return { success: false, error: (err as Error).message };
  }
}


// ─── sendContactNotification ──────────────────────────────────────────────
export async function sendContactNotification(
  adminEmail: string,
  sender: { name: string; email: string; phone?: string; subject: string; message: string }
): Promise<EmailResult> {
  try {
    const result = await sendViaResend({
      to: adminEmail,
      replyTo: sender.email,
      subject: `[High School Youth Club] New Contact Message: ${sender.subject}`,
      html: buildContactNotificationHtml(sender),
    });
    return result;
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

// ─── sendNoticeBlast ──────────────────────────────────────────────────────
export async function sendNoticeBlast(
  recipients: string[],
  notice: { title: string; summary: string; link: string }
): Promise<EmailResult> {
  try {
    // Batch in chunks of 50 (Resend rate limit per request)
    const BATCH_SIZE = 50;
    const chunks = [];
    for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
      chunks.push(recipients.slice(i, i + BATCH_SIZE));
    }

    for (const chunk of chunks) {
      const [firstRecipient, ...bccRecipients] = chunk;
      if (!firstRecipient) continue;
      const res = await sendViaResend({
        to: firstRecipient,
        bcc: bccRecipients.length > 0 ? bccRecipients : undefined,
        subject: `[High School Youth Club Notice] ${notice.title}`,
        html: buildNoticeBlastHtml(notice),
      });
      if (!res.success) {
        logger.warn('Notice blast chunk failed to send:', res.error);
      }
    }

    return { success: true };
  } catch (err) {
    logger.error('Notice blast email failed:', err);
    return { success: false, error: (err as Error).message };
  }
}

// ─── Email Templates ──────────────────────────────────────────────────────
function buildWelcomeHtml(name: string): string {
  return `<!DOCTYPE html>
<html>
<body style="font-family: 'Plus Jakarta Sans', sans-serif; background: #FAF8F5; margin: 0; padding: 40px 20px;">
  <div style="max-width: 560px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
    <div style="background: linear-gradient(135deg, #9E1B1B 0%, #7A1212 100%); padding: 40px; text-align: center;">
      <h1 style="color: #fff; margin: 0; font-size: 28px; font-weight: 700;">High School Youth Club</h1>
      <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px;">Gulariya, Krishnapur-5, Kanchanpur</p>
    </div>
    <div style="padding: 40px;">
      <h2 style="color: #1F2421; font-size: 22px; margin: 0 0 16px;">Welcome, ${name}! 🙏</h2>
      <p style="color: #4C574C; line-height: 1.6; margin: 0 0 24px;">Your account has been created. You can now access the High School Youth Club Portal.</p>
      <p style="color: #4C574C; line-height: 1.6; margin: 0;">If you have any questions, please contact us at <a href="mailto:${config.RESEND_FROM_EMAIL}" style="color: #9E1B1B;">${config.RESEND_FROM_EMAIL}</a>.</p>
    </div>
    <div style="background: #F0EDE7; padding: 24px; text-align: center;">
      <p style="color: #9BA39B; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} High School Youth Club. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
}

function buildPasswordResetHtml(name: string, resetLink: string): string {
  return `<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; background: #FAF8F5; margin: 0; padding: 40px 20px;">
  <div style="max-width: 560px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
    <div style="background: linear-gradient(135deg, #9E1B1B 0%, #7A1212 100%); padding: 40px; text-align: center;">
      <h1 style="color: #fff; margin: 0; font-size: 28px;">High School Youth Club</h1>
    </div>
    <div style="padding: 40px;">
      <h2 style="color: #1F2421; margin: 0 0 16px;">Reset Your Password</h2>
      <p style="color: #4C574C; line-height: 1.6;">Hi ${name}, you requested a password reset. Click the button below:</p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${resetLink}" style="background: #9E1B1B; color: #fff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">Reset Password</a>
      </div>
    </div>
  </div>
</body>
</html>`;
}

function buildContactNotificationHtml(sender: { name: string; email: string; phone?: string; subject: string; message: string }): string {
  return `<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; background: #FAF8F5; margin: 0; padding: 40px 20px;">
  <div style="max-width: 560px; margin: 0 auto; background: #fff; border-radius: 16px; padding: 40px;">
    <h2 style="color: #1F2421; margin: 0 0 24px;">New Contact Message</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <tr><td style="padding: 8px 0; color: #9BA39B; font-size: 13px; width: 80px;">From:</td><td style="color: #1F2421;">${sender.name} &lt;${sender.email}&gt;</td></tr>
      ${sender.phone ? `<tr><td style="padding: 8px 0; color: #9BA39B; font-size: 13px;">Phone:</td><td style="color: #1F2421;">${sender.phone}</td></tr>` : ''}
      <tr><td style="padding: 8px 0; color: #9BA39B; font-size: 13px;">Subject:</td><td style="color: #1F2421; font-weight: 600;">${sender.subject}</td></tr>
    </table>
    <div style="background: #FAF8F5; border-radius: 8px; padding: 20px; margin-top: 24px;">
      <p style="color: #1F2421; line-height: 1.7; margin: 0;">${sender.message.replace(/\n/g, '<br>')}</p>
    </div>
  </div>
</body>
</html>`;
}

function buildNoticeBlastHtml(notice: { title: string; summary: string; link: string }): string {
  return `<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; background: #FAF8F5; margin: 0; padding: 40px 20px;">
  <div style="max-width: 560px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden;">
    <div style="background: linear-gradient(135deg, #9E1B1B 0%, #7A1212 100%); padding: 32px; text-align: center;">
      <p style="color: rgba(255,255,255,0.8); margin: 0 0 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">High School Youth Club Notice</p>
      <h2 style="color: #fff; margin: 0; font-size: 22px;">${notice.title}</h2>
    </div>
    <div style="padding: 40px;">
      <p style="color: #4C574C; line-height: 1.7; margin: 0 0 24px;">${notice.summary}</p>
      <a href="${notice.link}" style="background: #9E1B1B; color: #fff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;">Read Full Notice</a>
    </div>
  </div>
</body>
</html>`;
}



