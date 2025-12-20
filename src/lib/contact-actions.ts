'use server';

import { Resend } from 'resend';
import {
  contactFormSchema,
  type ContactFormData,
  getContactTypeLabel,
} from './contact-schema';

const resend = new Resend(process.env.RESEND_API_KEY);

type ContactActionResult = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

type TurnstileResponse = {
  success: boolean;
  hostname?: string;
  'error-codes'?: string[];
};

async function verifyTurnstileToken(token: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    console.error('TURNSTILE_SECRET_KEY is not configured');
    return false;
  }

  try {
    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          secret: secretKey,
          response: token,
        }),
      }
    );

    const data: TurnstileResponse = await response.json();

    if (!data.success) {
      console.warn('Turnstile verification failed:', data['error-codes']);
      return false;
    }

    const allowedHosts = (
      process.env.TURNSTILE_ALLOWED_HOSTS || 'localhost,kuhi.jp'
    )
      .split(',')
      .map((host) => host.trim())
      .filter((host) => host.length > 0);

    const hostname = data.hostname?.trim();

    if (hostname && !allowedHosts.includes(hostname)) {
      console.warn('Turnstile hostname mismatch:', hostname);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return false;
  }
}

function generateEmailBody(data: ContactFormData): string {
  const lines = [
    '【お問い合わせ内容】',
    '',
    `■ 種別: ${getContactTypeLabel(data.contactType)}`,
    '',
  ];

  if (data.name) {
    lines.push(`■ お名前: ${data.name}`, '');
  }

  if (data.email) {
    lines.push(`■ メールアドレス: ${data.email}`, '');
  }

  if (data.targetUrl) {
    lines.push(`■ 対象URL: ${data.targetUrl}`, '');
  }

  lines.push('■ お問い合わせ内容:', data.message, '');
  lines.push('---');
  lines.push(`送信日時: ${new Date().toLocaleString('ja-JP')}`);

  return lines.join('\n');
}

export async function submitContactForm(
  formData: ContactFormData
): Promise<ContactActionResult> {
  const validationResult = contactFormSchema.safeParse(formData);

  if (!validationResult.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of validationResult.error.issues) {
      const path = issue.path.join('.');
      if (!errors[path]) {
        errors[path] = [];
      }
      errors[path].push(issue.message);
    }
    return {
      success: false,
      message: '入力内容に不備があります。ご確認のうえ、再度お試しください。',
      errors,
    };
  }

  const data = validationResult.data;

  const isTurnstileValid = await verifyTurnstileToken(data.turnstileToken);

  if (!isTurnstileValid) {
    return {
      success: false,
      message: '認証に失敗しました。もう一度お試しください。',
      errors: { turnstileToken: ['認証の検証に失敗しました'] },
    };
  }

  const toEmail = process.env.CONTACT_TO_EMAIL;

  if (!toEmail) {
    console.error('CONTACT_TO_EMAIL is not configured');
    return {
      success: false,
      message:
        'システム上の問題が発生しました。時間をおいて再度お試しください。',
    };
  }

  try {
    const subject = `【くひめぐり】${getContactTypeLabel(data.contactType)}`;
    const body = generateEmailBody(data);

    const { data: resendData, error: resendError } = await resend.emails.send({
      from: 'くひめぐり <noreply@kuhi.jp>',
      to: [toEmail],
      subject,
      text: body,
      replyTo: data.email || undefined,
    });

    if (resendError) {
      console.error('Resend error:', resendError);
      return {
        success: false,
        message: 'メールの送信に失敗しました。時間をおいて再度お試しください。',
      };
    }

    if (!resendData?.id) {
      console.error('Resend: unexpected response', resendData);
      return {
        success: false,
        message:
          'メール送信中に問題が発生しました。時間をおいて再度お試しください。',
      };
    }

    return {
      success: true,
      message: 'お問い合わせを受け付けました。ありがとうございます。',
    };
  } catch (error) {
    console.error('Contact form submission error:', error);
    return {
      success: false,
      message:
        '予期しないエラーが発生しました。時間をおいて再度お試しください。',
    };
  }
}
