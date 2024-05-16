import HomePage from '@/components/pages/Homepage';
import { getHomepageConfig } from '@/components/pages/Homepage/getHomepageConfig';
import config from '@/config/env';

export const metadata = {
  alternates: {
    canonical: `${config.baseUrl}/`,
  },
};

export const dynamic = 'force-dynamic';

const HomepagePage = async () => {
  const props = await getHomepageConfig();
  return <HomePage {...props} />;
};

export default HomepagePage;
