import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';

function sanitizeForEmail(input: string, maxLength = 2000): string {
  if (!input) return '';
  // eslint-disable-next-line no-control-regex
  const controlCharPattern = /[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]+/g;
  return input
    .replace(/\r/g, '')
    .replace(controlCharPattern, '')
    .trim()
    .slice(0, maxLength);
}

// generateEmailBodyのロジックをテスト
function generateEmailBody(data: {
  name?: string;
  email?: string;
  contactType: string;
  targetUrl?: string;
  message: string;
}): string {
  const getContactTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      copyright: '著作権・権利に関する問い合わせ',
      error: '誤りの指摘',
      suggestion: '修正・追加の提案',
      other: 'その他',
    };
    return labels[type] || 'その他';
  };

  const lines = [
    '【くひめぐり】お問い合わせがありました',
    '',
    '---',
    '',
    `■ 問い合わせ種別: ${sanitizeForEmail(getContactTypeLabel(data.contactType))}`,
  ];

  if (data.name) {
    lines.push(`■ お名前: ${sanitizeForEmail(data.name, 100)}`);
  }

  if (data.email) {
    lines.push(`■ メールアドレス: ${sanitizeForEmail(data.email, 254)}`);
  }

  if (data.targetUrl) {
    lines.push(`■ 対象URL: ${sanitizeForEmail(data.targetUrl, 2000)}`);
  }

  lines.push(
    '',
    '■ メッセージ:',
    sanitizeForEmail(data.message, 2000),
    '',
    '---'
  );

  return lines.join('\n');
}

describe('sanitizeForEmail', () => {
  test('CRをLFではなく空文字に変換すること', () => {
    const input = 'line1\rline2\rline3';
    const result = sanitizeForEmail(input);
    expect(result).toBe('line1line2line3');
  });

  test('CRLFからCRが除去されLFのみ残ること', () => {
    const input = 'line1\r\nline2\r\nline3';
    const result = sanitizeForEmail(input);
    expect(result).toBe('line1\nline2\nline3');
  });

  test('制御文字を除去すること', () => {
    const nul = String.fromCharCode(0x00);
    const unitSep = String.fromCharCode(0x1f);
    const input = `hello${nul}world${unitSep}test`;
    const result = sanitizeForEmail(input);
    expect(result).toBe('helloworldtest');
  });

  test('改行とタブは保持すること', () => {
    const input = 'hello\nworld\ttab';
    const result = sanitizeForEmail(input);
    expect(result).toBe('hello\nworld\ttab');
  });

  test('前後の空白をトリムすること', () => {
    const input = '  hello world  ';
    const result = sanitizeForEmail(input);
    expect(result).toBe('hello world');
  });

  test('指定された長さに切り詰めること', () => {
    const input = 'a'.repeat(100);
    const result = sanitizeForEmail(input, 50);
    expect(result).toHaveLength(50);
  });

  test('空文字を渡すと空文字を返すこと', () => {
    expect(sanitizeForEmail('')).toBe('');
  });

  test('複合的なケースを正しく処理すること', () => {
    const nul = String.fromCharCode(0x00);
    const unitSep = String.fromCharCode(0x1f);
    const input = `  \r\nHello${nul}\r\n${unitSep}World  `;
    const result = sanitizeForEmail(input);
    expect(result).toBe('Hello\nWorld');
  });
});

describe('generateEmailBody', () => {
  test('必須フィールドのみの場合の本文生成', () => {
    const data = {
      contactType: 'other',
      message: 'テストメッセージです。',
    };
    const result = generateEmailBody(data);

    expect(result).toContain('【くひめぐり】お問い合わせがありました');
    expect(result).toContain('■ 問い合わせ種別: その他');
    expect(result).toContain('■ メッセージ:');
    expect(result).toContain('テストメッセージです。');
    expect(result).not.toContain('■ お名前:');
    expect(result).not.toContain('■ メールアドレス:');
    expect(result).not.toContain('■ 対象URL:');
  });

  test('全フィールド入力時の本文生成', () => {
    const data = {
      name: '山田太郎',
      email: 'test@example.com',
      contactType: 'copyright',
      targetUrl: 'https://kuhi.jp/monument/1',
      message: 'これはテストメッセージです。',
    };
    const result = generateEmailBody(data);

    expect(result).toContain(
      '■ 問い合わせ種別: 著作権・権利に関する問い合わせ'
    );
    expect(result).toContain('■ お名前: 山田太郎');
    expect(result).toContain('■ メールアドレス: test@example.com');
    expect(result).toContain('■ 対象URL: https://kuhi.jp/monument/1');
    expect(result).toContain('これはテストメッセージです。');
  });

  test('各問い合わせ種別のラベルが正しいこと', () => {
    const types = [
      { value: 'copyright', label: '著作権・権利に関する問い合わせ' },
      { value: 'error', label: '誤りの指摘' },
      { value: 'suggestion', label: '修正・追加の提案' },
      { value: 'other', label: 'その他' },
    ];

    types.forEach(({ value, label }) => {
      const data = {
        contactType: value,
        message: 'テスト',
      };
      const result = generateEmailBody(data);
      expect(result).toContain(`■ 問い合わせ種別: ${label}`);
    });
  });

  test('制御文字を含むデータがサニタイズされること', () => {
    const name = String.fromCharCode(0x00);
    const unitSep = String.fromCharCode(0x1f);
    const data = {
      name: `test${name}user`,
      email: 'test@example.com',
      contactType: 'other',
      message: `hello\r\nworld${unitSep}`,
    };
    const result = generateEmailBody(data);

    expect(result).toContain('■ お名前: testuser');
    expect(result).toContain('hello\nworld');
    expect(result).not.toContain(name);
    expect(result).not.toContain(unitSep);
    expect(result).not.toContain('\r');
  });
});

describe('submitContactForm', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
    process.env.TURNSTILE_SECRET_KEY = 'test-secret-key';
    process.env.TURNSTILE_ALLOWED_HOSTS = 'localhost,kuhi.jp';
    process.env.RESEND_API_KEY = 're_test_key';
    process.env.CONTACT_TO_EMAIL = 'admin@kuhi.jp';
    process.env.CONTACT_FROM_EMAIL = 'noreply@kuhi.jp';
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  test('バリデーションエラーが正しく返されること', async () => {
    const { contactFormSchema } = await import('@/lib/contact-schema');

    const invalidFormData = {
      contactType: '',
      message: '',
      turnstileToken: '',
    };

    const result = contactFormSchema.safeParse(invalidFormData);
    expect(result.success).toBe(false);
  });

  test('有効なフォームデータがスキーマを通過すること', async () => {
    const { contactFormSchema } = await import('@/lib/contact-schema');

    const validFormData = {
      contactType: 'other',
      message: 'これは有効なテストメッセージです。',
      turnstileToken: 'valid-token-12345',
    };

    const result = contactFormSchema.safeParse(validFormData);
    expect(result.success).toBe(true);
  });
});
