import B2BUserGuard from '@/components/molecules/B2BUserGuard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function ProAuthenticatedLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return <B2BUserGuard>{children}</B2BUserGuard>;
}
