import Link from '@/components/atoms/Link';
import PageContainer from '@/components/atoms/PageContainer';
import SocialLogins from '@/components/molecules/SocialLogins';
import { getDictionary } from '@/i18n/translate';
import LoginForm from './_components/LoginPasswordForm';

const dict = getDictionary('fr');

export default function LoginPage() {
  return (
    <PageContainer size="small">
      <div className="flex flex-col gap-3">
        <h2 className="mb-4 text-center text-2xl font-bold uppercase">
          {dict.login.inputs.title}
        </h2>
        <LoginForm />
        <div className="flex justify-between">
          <Link href="/account/register">{dict.login.signupLink}</Link>
          <Link href="/account/send-reset-password">
            {dict.login.resetPasswordLink}
          </Link>
        </div>
        <hr />
        <SocialLogins />
      </div>
    </PageContainer>
  );
}
