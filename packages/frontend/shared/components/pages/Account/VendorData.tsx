'use client';

import PageContainer from '@/components/atoms/PageContainer';
import Loader from '@/components/atoms/Loader';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { useEffect } from 'react';
import useBackend from '@/hooks/useBackend';
import { operations } from '@/__generated/rest-schema';

const VendorData: React.FC = () => {
  const { fetchAPI } = useBackend();
  const fetchDashboardUrl = async (): Promise<
    operations['CustomerController_fetchVendorDataUrl']['responses']['default']['content']['application/json']
  > => {
    return await fetchAPI(`/v1/customers/vendor-data`, {
      method: 'GET',
    });
  };

  const [{ loading, value, error }, doFetchDashboardUrl] =
    useWrappedAsyncFn(fetchDashboardUrl);

  useEffect(() => {
    doFetchDashboardUrl();
  }, []);

  if (loading || error) {
    return <Loader className="h-6 w-6 self-center" />;
  }
  return (
    <PageContainer>
      <div className="flex flex-col gap-5 p-5">
        <h1 className="mb-3 text-3xl font-semibold">
          Mes données personnalisées
        </h1>
        <iframe
          src={value?.url}
          width="100%"
          height="1200"
          allowTransparency={true}
        />
      </div>
    </PageContainer>
  );
};

export default VendorData;
