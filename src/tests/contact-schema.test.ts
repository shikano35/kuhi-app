import { describe, test, expect } from 'vitest';
import {
  contactFormSchema,
  contactTypes,
  getContactTypeLabel,
  type ContactType,
} from '@/lib/contact-schema';

describe('contact-schema', () => {
  describe('contactTypes', () => {
    test('4つの問い合わせ種別が定義されていること', () => {
      expect(contactTypes).toHaveLength(4);
    });

    test('各種別にvalueとlabelが存在すること', () => {
      contactTypes.forEach((type) => {
        expect(type).toHaveProperty('value');
        expect(type).toHaveProperty('label');
        expect(typeof type.value).toBe('string');
        expect(typeof type.label).toBe('string');
      });
    });
  });

  describe('getContactTypeLabel', () => {
    test.each([
      ['copyright', '著作権・権利に関する問い合わせ'],
      ['error', '誤りの指摘'],
      ['suggestion', '修正・追加の提案'],
      ['other', 'その他'],
    ] as [ContactType, string][])(
      '%s のラベルが %s であること',
      (value, expectedLabel) => {
        expect(getContactTypeLabel(value)).toBe(expectedLabel);
      }
    );

    test('不明な値の場合は「その他」を返すこと', () => {
      // @ts-expect-error Testing invalid input value to verify fallback behavior
      expect(getContactTypeLabel('unknown')).toBe('その他');
    });
  });

  describe('contactFormSchema - 正常系', () => {
    test('必須フィールドのみで有効なデータ', () => {
      const validData = {
        contactType: 'other',
        message: 'これはテストメッセージです。',
        turnstileToken: 'valid-token',
      };
      const result = contactFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('全フィールド入力で有効なデータ', () => {
      const validData = {
        name: '山田太郎',
        email: 'test@example.com',
        contactType: 'copyright',
        targetUrl: 'https://kuhi.jp/monument/1',
        message: 'これはテストメッセージです。',
        turnstileToken: 'valid-token',
      };
      const result = contactFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('空文字のオプションフィールドがundefinedに変換されること', () => {
      const dataWithEmptyStrings = {
        name: '',
        email: '',
        contactType: 'other',
        targetUrl: '',
        message: 'これはテストメッセージです。',
        turnstileToken: 'valid-token',
      };
      const result = contactFormSchema.safeParse(dataWithEmptyStrings);
      expect(result.success).toBe(true);
      expect(
        (result as { success: true; data: { name?: string } }).data.name
      ).toBeUndefined();
      expect(
        (result as { success: true; data: { email?: string } }).data.email
      ).toBeUndefined();
      expect(
        (result as { success: true; data: { targetUrl?: string } }).data
          .targetUrl
      ).toBeUndefined();
    });

    test('前後の空白がトリムされること', () => {
      const dataWithWhitespace = {
        name: '  山田太郎  ',
        email: '  test@example.com  ',
        contactType: 'other',
        targetUrl: '  https://kuhi.jp/monument/1  ',
        message: 'これはテストメッセージです。',
        turnstileToken: 'valid-token',
      };
      const result = contactFormSchema.safeParse(dataWithWhitespace);
      expect(result.success).toBe(true);
      expect(
        (result as { success: true; data: { name?: string } }).data.name
      ).toBe('山田太郎');
      expect(
        (result as { success: true; data: { email?: string } }).data.email
      ).toBe('test@example.com');
      expect(
        (result as { success: true; data: { targetUrl?: string } }).data
          .targetUrl
      ).toBe('https://kuhi.jp/monument/1');
    });

    test('空白のみの文字列がundefinedに変換されること', () => {
      const dataWithOnlyWhitespace = {
        name: '   ',
        email: '   ',
        contactType: 'other',
        targetUrl: '   ',
        message: 'これはテストメッセージです。',
        turnstileToken: 'valid-token',
      };
      const result = contactFormSchema.safeParse(dataWithOnlyWhitespace);
      expect(result.success).toBe(true);
      expect(
        (result as { success: true; data: { name?: string } }).data.name
      ).toBeUndefined();
      expect(
        (result as { success: true; data: { email?: string } }).data.email
      ).toBeUndefined();
      expect(
        (result as { success: true; data: { targetUrl?: string } }).data
          .targetUrl
      ).toBeUndefined();
    });
  });

  describe('contactFormSchema - 異常系', () => {
    test('メッセージが短すぎる場合はエラー', () => {
      const invalidData = {
        contactType: 'other',
        message: 'あ',
        turnstileToken: 'valid-token',
      };
      const result = contactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(
        (
          result as {
            success: false;
            error: { issues: Array<{ path: string[] }> };
          }
        ).error.issues[0].path
      ).toContain('message');
    });

    test('メッセージが長すぎる場合はエラー', () => {
      const invalidData = {
        contactType: 'other',
        message: 'あ'.repeat(2001),
        turnstileToken: 'valid-token',
      };
      const result = contactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(
        (
          result as {
            success: false;
            error: { issues: Array<{ path: string[] }> };
          }
        ).error.issues[0].path
      ).toContain('message');
    });

    test('名前が長すぎる場合はエラー', () => {
      const invalidData = {
        name: 'あ'.repeat(101),
        contactType: 'other',
        message: 'これはテストメッセージです。',
        turnstileToken: 'valid-token',
      };
      const result = contactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(
        (
          result as {
            success: false;
            error: { issues: Array<{ path: string[] }> };
          }
        ).error.issues[0].path
      ).toContain('name');
    });

    test('無効なメールアドレスの場合はエラー', () => {
      const invalidData = {
        email: 'invalid-email',
        contactType: 'other',
        message: 'これはテストメッセージです。',
        turnstileToken: 'valid-token',
      };
      const result = contactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(
        (
          result as {
            success: false;
            error: { issues: Array<{ path: string[] }> };
          }
        ).error.issues[0].path
      ).toContain('email');
    });

    test('無効なURLの場合はエラー', () => {
      const invalidData = {
        targetUrl: 'not-a-url',
        contactType: 'other',
        message: 'これはテストメッセージです。',
        turnstileToken: 'valid-token',
      };
      const result = contactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(
        (
          result as {
            success: false;
            error: { issues: Array<{ path: string[] }> };
          }
        ).error.issues[0].path
      ).toContain('targetUrl');
    });

    test('無効なcontactTypeの場合はエラー', () => {
      const invalidData = {
        contactType: 'invalid-type',
        message: 'これはテストメッセージです。',
        turnstileToken: 'valid-token',
      };
      const result = contactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    test('turnstileTokenが空の場合はエラー', () => {
      const invalidData = {
        contactType: 'other',
        message: 'これはテストメッセージです。',
        turnstileToken: '',
      };
      const result = contactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(
        (
          result as {
            success: false;
            error: { issues: Array<{ path: string[] }> };
          }
        ).error.issues[0].path
      ).toContain('turnstileToken');
    });

    test('contactTypeが未指定の場合はエラー', () => {
      const invalidData = {
        message: 'これはテストメッセージです。',
        turnstileToken: 'valid-token',
      };
      const result = contactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    test('messageが未指定の場合はエラー', () => {
      const invalidData = {
        contactType: 'other',
        turnstileToken: 'valid-token',
      };
      const result = contactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
