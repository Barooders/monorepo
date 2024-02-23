import { getDictionary } from '@/i18n/translate';

const dict = getDictionary('fr');

export const metadata = {
  title: dict.login.head.title,
  robots: {
    index: false,
    follow: false,
  },
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
