import WebOnlyScripts from '@/document/scripts/WebOnlyScripts';

export default function RootLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <>
      <WebOnlyScripts />
      {children}
    </>
  );
}
