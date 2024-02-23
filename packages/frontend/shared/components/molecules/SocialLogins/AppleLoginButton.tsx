'use client';

import Link from '@/components/atoms/Link';
import Apple from '@/components/icons/Apple';
import { getDictionary } from '@/i18n/translate';

type PropsType = { type?: 'login' | 'signup' };

const AppleLoginButton: React.FC<PropsType> = ({ type = 'login' }) => {
  const redirectTo = new URL(window.location.toString());
  redirectTo.pathname = '/auth-callback';

  const appleProviderUrl = `${process.env.NEXT_PUBLIC_HASURA_AUTH_BASE_URL}/signin/provider/apple?redirectTo=${redirectTo}`;
  const labels = getDictionary('fr');

  return (
    <Link
      href={appleProviderUrl}
      className="flex h-[40px] cursor-pointer flex-row items-center justify-center rounded bg-black text-white transition-colors"
    >
      <div className="ml-[2px] flex h-[20px] w-[20px] items-center justify-center text-white">
        <Apple />
      </div>
      <p className="ml-4 text-sm">{labels.login.social.apple[type]}</p>
    </Link>
  );
};

export default AppleLoginButton;
