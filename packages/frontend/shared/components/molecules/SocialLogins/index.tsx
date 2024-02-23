import NoSSR from '@/components/atoms/NoSSR';
import AppleLoginButton from './AppleLoginButton';
import GoogleLoginButton from './GoogleLoginButton';

type PropsType = { type?: 'login' | 'signup' };

const SocialLogins: React.FC<PropsType> = ({ type = 'login' }) => {
  return (
    <NoSSR>
      <div className="m-auto flex w-64 flex-col gap-2">
        <GoogleLoginButton type={type} />
        <AppleLoginButton type={type} />
      </div>
    </NoSSR>
  );
};

export default SocialLogins;
