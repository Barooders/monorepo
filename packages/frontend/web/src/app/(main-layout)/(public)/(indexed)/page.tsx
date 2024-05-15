import config from '@/config/env';
import HomePage, { getData } from '@/components/pages/Homepage';

export const metadata = {
  alternates: {
    canonical: `${config.baseUrl}/`,
  },
};

export const dynamic = 'force-dynamic';

const HomepagePage = async () => {
  const props = await getData();
  return <HomePage {...props} />;
};

export default HomepagePage;
