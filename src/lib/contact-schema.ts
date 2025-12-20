import { z } from 'zod';

export const contactTypes = [
  { value: 'copyright', label: '著作権・権利に関する問い合わせ' },
  { value: 'error', label: '誤りの指摘' },
  { value: 'suggestion', label: '修正・追加の提案' },
  { value: 'other', label: 'その他' },
] as const;

export type ContactType = (typeof contactTypes)[number]['value'];

export const contactFormSchema = z.object({
  name: z
    .string()
    .max(100, '名前は100文字以内で入力してください')
    .optional()
    .or(z.literal('')),
  email: z
    .string()
    .email('有効なメールアドレスを入力してください')
    .optional()
    .or(z.literal('')),
  contactType: z.enum(['copyright', 'error', 'suggestion', 'other'], {
    required_error: 'お問い合わせ種別を選択してください',
  }),
  targetUrl: z
    .string()
    .url('有効なURLを入力してください')
    .optional()
    .or(z.literal('')),
  message: z
    .string()
    .min(5, 'お問い合わせ内容は5文字以上で入力してください')
    .max(2000, 'お問い合わせ内容は2000文字以内で入力してください'),
  turnstileToken: z.string().min(1, '認証が必要です'),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export function getContactTypeLabel(value: ContactType): string {
  return contactTypes.find((type) => type.value === value)?.label || 'その他';
}
