import Loader from '@/components/atoms/Loader';
import PageContainer from '@/components/atoms/PageContainer';
import Script from 'next/script';

const BuyNowForm = () => (
  <PageContainer size="small">
    <Loader className="m-auto" />
    <div data-tf-live="01HGFY08QQW0GTYP89K2V8AC5H"></div>
    <Script src={`//embed.typeform.com/next/embed.js`} />
  </PageContainer>
);

export default BuyNowForm;
