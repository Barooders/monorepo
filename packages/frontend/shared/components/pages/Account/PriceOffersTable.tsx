'use client';

import { FetchPriceOffersQuery } from '@/__generated/graphql';
import Loader from '@/components/atoms/Loader';
import PageContainer from '@/components/atoms/PageContainer';
import SmallCard from '@/components/atoms/SmallCard';
import VirtualizedTable from '@/components/atoms/VirtualizedTable';
import { useHasura } from '@/hooks/useHasura';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { getDictionary } from '@/i18n/translate';
import { gql } from '@apollo/client';
import { useEffect } from 'react';
import { HASURA_ROLES } from 'shared-types';
import { PRICE_OFFER_STATUS_COLORS } from './config';
import { PriceOfferStatus } from './types';

const dict = getDictionary('fr');

const getDisplayedStatus = (status: PriceOfferStatus) => {
  return (
    dict.account.priceOfferStatus[status]?.long ??
    dict.account.priceOfferStatus.unknown.long
  );
};

type PriceOffer = {
  product: {
    title: string | null;
    tag: string | null;
    imageSrc: string | null;
  };
  price: string;
  quantity: string;
  createdAtDate: string;
  note: string;
  status: PriceOfferStatus;
};

const FETCH_PRICE_OFFERS = gql`
  query fetchPriceOffers {
    PriceOffer {
      id
      createdAt
      publicNote
      quantity
      status
      product {
        storeExposedProduct {
          brand
          productType
          size
          firstImage
        }
      }
      newPriceInCents
    }
  }
`;

const PriceOffersTable = () => {
  const fetchPriceOffers = useHasura<FetchPriceOffersQuery>(
    FETCH_PRICE_OFFERS,
    HASURA_ROLES.ME_AS_CUSTOMER,
  );

  const [{ loading, error, value }, doFetchPriceOffers] = useWrappedAsyncFn<
    () => Promise<PriceOffer[]>
  >(async () => {
    const { PriceOffer: priceOffers } = await fetchPriceOffers();

    return priceOffers.map(
      ({
        status,
        product,
        quantity,
        newPriceInCents,
        createdAt,
        publicNote,
      }) => ({
        product: {
          title: product?.storeExposedProduct?.brand ?? '',
          tag: product?.storeExposedProduct?.productType ?? '',
          imageSrc: product?.storeExposedProduct?.firstImage ?? '',
        },
        price: newPriceInCents
          ? `${(Number(newPriceInCents) / 100).toFixed(2)} €`
          : '',
        quantity: String(quantity),
        createdAtDate: new Date(createdAt).toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        note: publicNote ?? '',
        status: status as PriceOfferStatus,
      }),
    );
  });

  useEffect(() => {
    doFetchPriceOffers();
  }, []);

  return (
    <PageContainer>
      <div className="mb-24">
        <h1 className="mb-3 text-3xl">{dict.priceOffers.title}</h1>
        {loading ? (
          <Loader className="m-auto h-8 w-8" />
        ) : error ? (
          <p className="text-red-600">{dict.global.errors.unknownError}</p>
        ) : value ? (
          <VirtualizedTable
            searchPlaceholder={dict.account.tables.searchPlaceholder.priceOffer}
            width={1268}
            desktopRowHeight={61}
            mobileRowHeight={252}
            rows={value.map(
              ({ status, price, product, quantity, createdAtDate, note }) => ({
                label: (
                  <SmallCard
                    title={product.title}
                    tag={product.tag}
                    imageSrc={product.imageSrc}
                    description=""
                  />
                ),
                price,
                quantity,
                createdAtDate,
                note,
                status: (
                  <div
                    className={`${PRICE_OFFER_STATUS_COLORS[status]} rounded px-1.5 py-1 font-semibold`}
                  >
                    {getDisplayedStatus(status)}
                  </div>
                ),
              }),
            )}
            columns={{
              desktopColumns: {
                label: {
                  width: 300,
                  label: dict.account.tables.columns.priceOffer,
                },
                price: {
                  width: 100,
                  label: dict.account.tables.columns.price,
                },
                quantity: {
                  width: 80,
                  label: dict.account.tables.columns.quantity,
                },
                createdAtDate: {
                  width: 200,
                  label: dict.account.tables.columns.createdAtDate,
                },
                note: {
                  width: 300,
                  label: dict.account.tables.columns.note,
                },
                status: {
                  width: 250,
                  label: dict.account.tables.columns.status,
                },
              },
              highlightedMobileColumns: ['status', 'label'],
            }}
          />
        ) : (
          <></>
        )}
      </div>
    </PageContainer>
  );
};

export default PriceOffersTable;
