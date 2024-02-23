export const metadata = {
  robots: { index: true, follow: true },
};

export default function IndexedLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return <>{children}</>;
}
