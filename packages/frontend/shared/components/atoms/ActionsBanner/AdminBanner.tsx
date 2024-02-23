import { useAuth } from '@/hooks/useAuth';
import ActionsBanner from '.';

type PropsType = {
  children: React.ReactNode;
};

const AdminBanner: React.FC<PropsType> = ({ children }) => {
  const { isAdmin } = useAuth();
  if (!isAdmin()) return <></>;

  return <ActionsBanner>{children}</ActionsBanner>;
};

export default AdminBanner;
