import { builder } from '@builder.io/sdk';
import config from '@/config/env';
import HomePage, { getData } from '@/components/pages/Homepage';

builder.init(process.env.NEXT_PUBLIC_BUILDER_IO_API_KEY ?? '');

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
