'use client';
import PageContainer from '@/components/atoms/PageContainer';
import PriceOffersTable from '@/components/pages/Account/PriceOffersTable';
import { getDictionary } from '@/i18n/translate';

const dict = getDictionary('fr');

const PriceOffersPage = () => (
  <PageContainer>
    <div className="mb-24">
      <h1 className="mb-3 text-3xl">{dict.priceOffers.title}</h1>
      <PriceOffersTable />
    </div>
  </PageContainer>
);

export default PriceOffersPage;
