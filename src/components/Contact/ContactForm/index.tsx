'use client';

import { useState, useRef, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import { Loader2, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  contactFormSchema,
  contactTypes,
  type ContactFormData,
} from '@/lib/contact-schema';
import { submitContactForm } from '@/lib/contact-actions';
import Link from 'next/link';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

interface ContactFormProps {
  siteKey: string;
}

export function ContactForm({ siteKey }: ContactFormProps) {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [serverMessage, setServerMessage] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      contactType: 'other',
      targetUrl: '',
      message: '',
      turnstileToken: '',
    },
  });

  const handleTurnstileSuccess = useCallback(
    (token: string) => {
      setTurnstileToken(token);
      setValue('turnstileToken', token);
    },
    [setValue]
  );

  const handleTurnstileError = useCallback(() => {
    setTurnstileToken(null);
    setValue('turnstileToken', '');
  }, [setValue]);

  const handleTurnstileExpire = useCallback(() => {
    setTurnstileToken(null);
    setValue('turnstileToken', '');
    turnstileRef.current?.reset();
  }, [setValue]);

  const onSubmit = async (data: ContactFormData) => {
    if (!turnstileToken) {
      setStatus('error');
      setServerMessage('認証を完了してください');
      return;
    }

    setStatus('submitting');
    setServerMessage('');

    try {
      const result = await submitContactForm(data);

      if (result.success) {
        setStatus('success');
        setServerMessage(result.message);
        reset();
        setTurnstileToken(null);
        turnstileRef.current?.reset();
      } else {
        setStatus('error');
        setServerMessage(result.message);
        setTurnstileToken(null);
        setValue('turnstileToken', '');
        turnstileRef.current?.reset();
      }
    } catch {
      setStatus('error');
      setServerMessage('予期しないエラーが発生しました');
      setTurnstileToken(null);
      setValue('turnstileToken', '');
      turnstileRef.current?.reset();
    }
  };

  if (status === 'success') {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50/80 p-8 text-center">
        <CheckCircle aria-hidden="true" className="mx-auto mb-4 h-12 w-12" />
        <h3 className="mb-2 font-bold text-lg text-primary">送信完了</h3>
        <p className="text-muted-foreground">{serverMessage}</p>
        <Button asChild className="mt-6" variant="outline">
          <Link href="/">トップページへ戻る</Link>
        </Button>
      </div>
    );
  }

  return (
    <form
      aria-label="お問い合わせフォーム"
      className="space-y-6"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      {status === 'error' && serverMessage && (
        <div
          className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300"
          role="alert"
        >
          <AlertCircle aria-hidden="true" className="h-5 w-5 shrink-0" />
          <span>{serverMessage}</span>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">
          お名前 <span className="text-muted-foreground text-sm">（任意）</span>
        </Label>
        <Input
          id="name"
          placeholder="山田 太郎"
          type="text"
          {...register('name')}
          aria-describedby={errors.name ? 'name-error' : undefined}
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p className="text-sm text-red-600 dark:text-red-400" id="name-error">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">
          メールアドレス{' '}
          <span className="text-muted-foreground text-sm">（任意）</span>
        </Label>
        <Input
          id="email"
          placeholder="example@email.com"
          type="email"
          {...register('email')}
          aria-describedby={errors.email ? 'email-error' : undefined}
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p
            className="text-sm text-red-600 dark:text-red-400"
            id="email-error"
          >
            {errors.email.message}
          </p>
        )}
        <p className="text-muted-foreground text-sm">
          ※ 返信をご希望の場合はメールアドレスをご入力ください
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactType">
          お問い合わせ種別{' '}
          <span className="text-red-600 dark:text-red-400">*</span>
        </Label>
        <Controller
          control={control}
          name="contactType"
          render={({ field }) => (
            <Select
              defaultValue={field.value}
              onValueChange={field.onChange}
              value={field.value}
            >
              <SelectTrigger
                aria-describedby={
                  errors.contactType ? 'contactType-error' : undefined
                }
                aria-invalid={!!errors.contactType}
                id="contactType"
              >
                <SelectValue placeholder="種別を選択" />
              </SelectTrigger>
              <SelectContent>
                {contactTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.contactType && (
          <p
            className="text-sm text-red-600 dark:text-red-400"
            id="contactType-error"
          >
            {errors.contactType.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="targetUrl">
          対象URL{' '}
          <span className="text-muted-foreground text-sm">（任意）</span>
        </Label>
        <Input
          id="targetUrl"
          placeholder="https://kuhi.jp/monument/1"
          type="url"
          {...register('targetUrl')}
          aria-describedby={errors.targetUrl ? 'targetUrl-error' : undefined}
          aria-invalid={!!errors.targetUrl}
        />
        {errors.targetUrl && (
          <p
            className="text-sm text-red-600 dark:text-red-400"
            id="targetUrl-error"
          >
            {errors.targetUrl.message}
          </p>
        )}
        <p className="text-muted-foreground text-sm">
          ※ 誤り指摘・修正提案の場合はURLをご入力ください
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">
          お問い合わせ内容{' '}
          <span className="text-red-600 dark:text-red-400">*</span>
        </Label>
        <Textarea
          id="message"
          placeholder="お問い合わせ内容をご記入ください"
          rows={6}
          {...register('message')}
          aria-describedby={errors.message ? 'message-error' : undefined}
          aria-invalid={!!errors.message}
        />
        {errors.message && (
          <p
            className="text-sm text-red-600 dark:text-red-400"
            id="message-error"
          >
            {errors.message.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        {siteKey ? (
          <>
            <Turnstile
              onError={handleTurnstileError}
              onExpire={handleTurnstileExpire}
              onSuccess={handleTurnstileSuccess}
              options={{
                theme: 'auto',
                language: 'ja',
              }}
              ref={turnstileRef}
              siteKey={siteKey}
            />
            {errors.turnstileToken && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.turnstileToken.message}
              </p>
            )}
          </>
        ) : (
          <p className="text-sm text-red-600 dark:text-red-400">
            セキュリティ保護機能（Turnstile）が正しく構成されていないため、現在フォームを送信できません。管理者は
            NEXT_PUBLIC_TURNSTILE_SITE_KEY を設定してください。
          </p>
        )}
      </div>

      <Button
        className="w-full"
        disabled={status === 'submitting' || !turnstileToken}
        type="submit"
      >
        {status === 'submitting' ? (
          <>
            <Loader2 aria-hidden="true" className="mr-2 h-4 w-4 animate-spin" />
            送信中...
          </>
        ) : (
          <>
            <Send aria-hidden="true" className="mr-2 h-4 w-4" />
            送信する
          </>
        )}
      </Button>
    </form>
  );
}
