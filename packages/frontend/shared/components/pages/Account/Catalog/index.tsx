'use client';
/* eslint-disable @next/next/no-img-element */
import PageContainer from '@/components/atoms/PageContainer';
import Tabs from '@/components/atoms/Tabs';
import { getDictionary } from '@/i18n/translate';
import OnlineProductsTable from './_components/OnlineProductsTable';
import OrdersTables from './_components/OrdersTable';
import { AccountSections } from '@/types';
import { useEffect, useState } from 'react';

const dict = getDictionary('fr');

export enum TAB_SLUGS {
  onlineProducts = 'onlineProducts',
  orders = 'orders',
}

const TABS = [
  {
    label: dict.account.sections[AccountSections.ORDERS].label,
    slug: TAB_SLUGS.orders,
    content: () => <OrdersTables />,
  },
  {
    label: dict.account.sections[AccountSections.ONLINE_PRODUCTS].label,
    slug: TAB_SLUGS.onlineProducts,
    content: () => <OnlineProductsTable />,
  },
];

type PropsType = {
  initialTab: TAB_SLUGS;
};

const defaultTab = TAB_SLUGS.orders;

const Catalog: React.FC<PropsType> = ({ initialTab }) => {
  const [selectedTab, setSelectedTab] = useState(defaultTab);

  useEffect(() => {
    setSelectedTab(
      !initialTab || !Object.values(TAB_SLUGS).includes(initialTab)
        ? defaultTab
        : TAB_SLUGS[initialTab],
    );
  }, [initialTab]);

  return (
    <PageContainer>
      <div className="mb-24">
        <h1 className="mb-3 text-3xl">{dict.catalog.title}</h1>
        <Tabs
          tabs={TABS}
          selectedTab={selectedTab}
        />
      </div>
    </PageContainer>
  );
};

export default Catalog;
