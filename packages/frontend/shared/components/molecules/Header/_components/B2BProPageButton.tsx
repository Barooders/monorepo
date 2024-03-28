'use client';
import { useAuth } from '@/hooks/useAuth';
import { getDictionary } from '@/i18n/translate';
import { MdVerified } from 'react-icons/md';
import HeaderButton from './HeaderButton';

const B2BProPageButton: React.FC = () => {
  const dictionnary = getDictionary('fr');
  const { isB2BUser } = useAuth();

  if (!isB2BUser()) return <></>;
  return (
    <HeaderButton
      href="/pro"
      title={dictionnary.header.icons.b2bPage}
    >
      <MdVerified className="h-full w-full fill-secondary-900" />
    </HeaderButton>
  );
};

export default B2BProPageButton;
