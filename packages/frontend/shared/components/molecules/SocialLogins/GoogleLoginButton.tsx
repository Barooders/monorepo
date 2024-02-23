'use client';

import Link from '@/components/atoms/Link';
import Google from '@/components/icons/Google';
import { getDictionary } from '@/i18n/translate';
import { Open_Sans } from 'next/font/google';

const open = Open_Sans({ subsets: ['latin'], display: 'swap' });

type PropsType = { type?: 'login' | 'signup' };

const GoogleLoginButton: React.FC<PropsType> = ({ type = 'login' }) => {
  const redirectTo = new URL(window.location.toString());
  redirectTo.pathname = '/auth-callback';

  const googleProviderUrl = `${process.env.NEXT_PUBLIC_HASURA_AUTH_BASE_URL}/signin/provider/google?redirectTo=${redirectTo}`;
  const labels = getDictionary('fr');
  return (
    <Link
      href={googleProviderUrl}
      className="flex cursor-pointer flex-row items-center rounded border border-[#4285f4] bg-[#4285f4]"
    >
      <div className="flex h-[40px] w-[40px] items-center justify-center rounded-l bg-white">
        <Google size="18px" />
      </div>
      <div
        className={`${open.className} flex-1 text-center text-sm text-white`}
      >
        {labels.login.social.google[type]}
      </div>
      {}
    </Link>
  );
};

export default GoogleLoginButton;
