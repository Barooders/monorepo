'use client'; // Error components must be Client components

import ErrorPanel from '@/components/atoms/ErrorPanel';
import useSentry from '@/hooks/useSentry';
import { useEffect } from 'react';

export default function Error({ error }: { error: Error; reset: () => void }) {
  const Sentry = useSentry();
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return <ErrorPanel />;
}
