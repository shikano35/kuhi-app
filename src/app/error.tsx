'use client';

import { ErrorPage } from '@/layouts/Error';

export type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  return <ErrorPage error={error} reset={reset} />;
}
