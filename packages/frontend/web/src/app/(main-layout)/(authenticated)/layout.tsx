import AuthenticationGuard from '@/components/molecules/AuthenticationGuard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return <AuthenticationGuard>{children}</AuthenticationGuard>;
}
