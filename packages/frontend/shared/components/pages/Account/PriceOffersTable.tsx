'use client';

import { graphql } from '@/__generated/gql/b2b_user';
import Loader from '@/components/atoms/Loader';
import SmallCard from '@/components/atoms/SmallCard';
import VirtualizedTable from '@/components/atoms/VirtualizedTable';
import { useHasura } from '@/hooks/useHasura';
import { useHasuraToken } from '@/hooks/useHasuraToken';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { getDictionary } from '@/i18n/translate';
import { useEffect } from 'react';
import { HASURA_ROLES } from 'shared-types';
import { PRICE_OFFER_STATUS_COLORS } from './config';
import { PriceOfferStatus } from './types';

const dict = getDictionary('fr');

const getPrice = (
  newPriceInCents: number,
  includedBuyerCommissionPercentage: number,
  buyerId: string,
  userId?: string,
) => {
  if (
    typeof newPriceInCents !== 'number' ||
    typeof includedBuyerCommissionPercentage !== 'number' ||
    !userId
  )
    return '';

  const priceInCents =
    buyerId === userId
      ? newPriceInCents
      : newPriceInCents / (1 + includedBuyerCommissionPercentage);

  return `${(priceInCents / 100).toFixed(2)} €`;
};

const getDisplayedStatus = (status: PriceOfferStatus) => {
  return (
    dict.account.priceOfferStatus[status]?.long ??
    dict.account.priceOfferStatus.unknown.long
  );
};

const FETCH_PRICE_OFFERS = /* GraphQL */ /* typed_for_b2b_user */ `
  query fetchPriceOffers {
    PriceOffer(order_by: { createdAt: desc }) {
      id
      buyerId
      includedBuyerCommissionPercentage
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
      productId
    }
  }
`;

const PriceOffersTable = () => {
  const { user } = useHasuraToken();
  const fetchPriceOffers = useHasura(
    graphql(FETCH_PRICE_OFFERS),
    HASURA_ROLES.B2B_USER,
  );

  const [{ loading, error, value }, doFetchPriceOffers] = useWrappedAsyncFn(
    async () => {
      const { PriceOffer: priceOffers } = await fetchPriceOffers();

      return priceOffers.map(
        ({
          status,
          product,
          quantity,
          newPriceInCents,
          includedBuyerCommissionPercentage,
          buyerId,
          createdAt,
          publicNote,
        }) => ({
          product: {
            title: product?.storeExposedProduct?.brand ?? '',
            tag: product?.storeExposedProduct?.productType ?? '',
            imageSrc: product?.storeExposedProduct?.firstImage ?? '',
          },
          price: getPrice(
            newPriceInCents,
            includedBuyerCommissionPercentage,
            buyerId,
            user?.id,
          ),
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
    },
  );

  useEffect(() => {
    doFetchPriceOffers();
  }, []);

  return loading ? (
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
  );
};

export default PriceOffersTable;
