'use client';
/* eslint-disable @next/next/no-img-element */
import {
  FetchAccountPageCustomerDataQuery,
  FetchAccountPageVendorDataQuery,
} from '@/__generated/graphql';
import Link from '@/components/atoms/Link';
import Loader from '@/components/atoms/Loader';
import PageContainer from '@/components/atoms/PageContainer';
import SmallCard from '@/components/atoms/SmallCard';
import { HASURA_ROLES } from '@/config';
import { useHasura } from '@/hooks/useHasura';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { getDictionary } from '@/i18n/translate';
import { gql } from '@apollo/client';
import { useEffect } from 'react';
import AccountMenu from './_components/AccountMenu';
import { mapProductFromGraphQl } from './_helpers/map-product';
import { MAX_PRODUCTS_PER_BLOCK, PRODUCTS_BY_SECTION } from './config';
import { AccountSections } from '@/types';
import { OrderStatus } from './types';

const getDisplayedStatus = (status: string | null) => {
  if (!status) return dict.account.orderStatus.unknown.short;

  return (
    dict.account.orderStatus[status as OrderStatus].short ??
    dict.account.orderStatus.unknown.short
  );
};

const dict = getDictionary('fr');

const STORE_PRODUCT_FRAGMENT = gql`
  fragment StoreProductFields on dbt_store_exposed_product {
    firstImage
    handle
    productType
    size
    gender
    modelYear
    brand
    product {
      variants(order_by: { variant: { price: asc } }, limit: 1) {
        variant {
          condition
          price
        }
      }
    }
  }
`;

const FETCH_ACCOUNT_PAGE_CUSTOMER_DATA = gql`
  ${STORE_PRODUCT_FRAGMENT}
  query fetchAccountPageCustomerData($maxItems: Int) {
    Customer(limit: 1) {
      lastName
      firstName
      sellerName
      profilePictureShopifyCdnUrl
      createdAt
      favorites(
        limit: $maxItems
        order_by: { createdAt: desc }
        where: {
          product: {
            status: { _eq: "ACTIVE" }
            variants: { quantity: { _gte: 1 } }
          }
        }
      ) {
        product {
          storeProduct: storeExposedProduct {
            ...StoreProductFields
          }
        }
      }
      purchasedOrders(limit: $maxItems, order_by: { createdAt: desc }) {
        id
        totalPriceInCents
        name
        status
        orderLines {
          name
          productBrand
          productImage
        }
      }
    }
  }
`;

const FETCH_ACCOUNT_PAGE_VENDOR_DATA = gql`
  ${STORE_PRODUCT_FRAGMENT}
  query fetchAccountPageVendorData($maxItems: Int) {
    Customer(limit: 1) {
      onlineProducts(
        limit: $maxItems
        order_by: { createdAt: desc }
        where: {
          variants: { quantity: { _gte: 1 } }
          status: { _neq: "ARCHIVED" }
        }
      ) {
        storeProduct: storeExposedProduct {
          ...StoreProductFields
        }
      }
      vendorSoldOrderLines(
        order_by: { createdAt: desc }
        where: { order: { status: { _neq: "CREATED" } } }
        limit: $maxItems
      ) {
        priceInCents
        name
        order {
          id
          status
          name
        }
        productBrand
        productImage
      }
    }
  }
`;

interface SectionCardProps {
  key: string | null;
  link: string;
  tag: string | null;
  title: string | undefined | null;
  description: string;
  price: string;
  imageSrc: string | null;
}

interface CustomerProps {
  firstName: string | null;
  lastName: string | null;
  sellerName: string | null;
  profilePictureShopifyCdnUrl: string | null;
  createdAt: string | null;
}

interface AccountPageData {
  customer: CustomerProps;
  sections: Record<AccountSections, SectionCardProps[]>;
}

const Account = () => {
  const fetchAccountPageCustomerData =
    useHasura<FetchAccountPageCustomerDataQuery>(
      FETCH_ACCOUNT_PAGE_CUSTOMER_DATA,
      HASURA_ROLES.ME_AS_CUSTOMER,
    );

  const fetchAccountPageVendorData = useHasura<FetchAccountPageVendorDataQuery>(
    FETCH_ACCOUNT_PAGE_VENDOR_DATA,
    HASURA_ROLES.ME_AS_VENDOR,
  );

  const [{ loading, error, value }, doFetchAccountPageData] = useWrappedAsyncFn<
    () => Promise<AccountPageData>
  >(async () => {
    const [
      {
        Customer: [
          {
            firstName,
            lastName,
            sellerName,
            profilePictureShopifyCdnUrl,
            createdAt,
            favorites,
            purchasedOrders,
          },
        ],
      },
      {
        Customer: [{ vendorSoldOrderLines, onlineProducts }],
      },
    ] = await Promise.all([
      fetchAccountPageCustomerData({
        maxItems: MAX_PRODUCTS_PER_BLOCK,
      }),
      fetchAccountPageVendorData({
        maxItems: MAX_PRODUCTS_PER_BLOCK,
      }),
    ]);

    return {
      customer: {
        firstName,
        lastName,
        sellerName,
        profilePictureShopifyCdnUrl,
        createdAt,
      },
      sections: {
        orders: vendorSoldOrderLines.reduce(
          (
            acc: SectionCardProps[],
            {
              order,
              productBrand,
              productImage,
              priceInCents,
              name,
            }: FetchAccountPageVendorDataQuery['Customer'][0]['vendorSoldOrderLines'][0],
          ) => {
            if (!order) return acc;

            return [
              ...acc,
              {
                key: order.name,
                link: `/account/order/${order.id}`,
                tag: getDisplayedStatus(order.status),
                title: order.name,
                description: [productBrand, name].filter(Boolean).join(' - '),
                price: priceInCents
                  ? `${(Number(priceInCents) / 100).toFixed(2)} €`
                  : '',
                imageSrc: productImage,
              },
            ];
          },
          [],
        ),
        purchases: purchasedOrders.reduce(
          (
            acc: SectionCardProps[],
            {
              totalPriceInCents,
              name: orderName,
              status,
              id,
              orderLines,
            }: FetchAccountPageCustomerDataQuery['Customer'][0]['purchasedOrders'][0],
          ) => {
            if (orderLines.length === 0) return acc;
            const firstProduct = orderLines[0];
            if (!firstProduct) return acc;

            const { productBrand, name, productImage: imageSrc } = firstProduct;

            return [
              ...acc,
              {
                key: orderName,
                link: `/account/order/${id}`,
                tag: getDisplayedStatus(status),
                title: orderName,
                description: [productBrand, name].filter(Boolean).join(' - '),
                price: totalPriceInCents
                  ? `${(Number(totalPriceInCents) / 100).toFixed(2)} €`
                  : '',
                imageSrc,
              },
            ];
          },
          [],
        ),
        favorites: favorites
          .flatMap((product) =>
            product?.product?.storeProduct
              ? [product.product.storeProduct]
              : [],
          )
          .map(mapProductFromGraphQl),
        onlineProducts: onlineProducts
          .flatMap((product) =>
            product.storeProduct ? [product.storeProduct] : [],
          )
          .map(mapProductFromGraphQl),
      },
    };
  });

  useEffect(() => {
    doFetchAccountPageData();
  }, []);

  return (
    <PageContainer>
      {error ? (
        <p className="text-red-600">{dict.global.errors.unknownError}</p>
      ) : (
        <div className="mb-24 grid grid-cols-12 gap-6">
          <div className="col-start-1 col-end-13 lg:col-end-10">
            <div className="flex flex-row rounded-lg border border-zinc-200 py-4 pl-4 pr-8">
              <div className="h-[80px] w-[80px] rounded-full bg-gray-200">
                <img
                  src={
                    value?.customer.profilePictureShopifyCdnUrl ??
                    'https://cdn.shopify.com/s/files/1/0576/4340/1365/files/incognito.png?width=80&height=80'
                  }
                  className="rounded-full object-cover"
                  alt="Profile picture"
                />
              </div>
              <div className="ml-5 flex grow flex-col items-start justify-between sm:flex-row sm:items-center">
                <div className="grow">
                  <div>
                    {value?.customer.firstName && (
                      <span className="text-xl font-bold text-gray-800">
                        {value.customer.firstName}
                      </span>
                    )}
                    {value?.customer.sellerName && (
                      <span className="ml-2">@{value.customer.sellerName}</span>
                    )}
                  </div>
                  {value?.customer.createdAt && (
                    <p className="mt-1 text-gray-600">
                      {dict.account.signedSinceThe}{' '}
                      {new Date(value.customer.createdAt).toLocaleDateString(
                        'fr-FR',
                        {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        },
                      )}
                    </p>
                  )}
                </div>
                {value?.customer.sellerName && (
                  <Link
                    href={`https://barooders.com/collections/vendors?q=${encodeURIComponent(
                      value.customer.sellerName,
                    )}`}
                    className="rounded-lg bg-gray-100 py-2.5 px-3 text-sm font-semibold uppercase"
                  >
                    {dict.account.seeMyShop}
                  </Link>
                )}
              </div>
            </div>
            <div className="col-start-1 col-end-10 mt-6 hidden lg:block">
              <div className="grid grid-cols-2 grid-rows-2 gap-4">
                {PRODUCTS_BY_SECTION.slice(0, 4).map((section) => (
                  <div
                    className="flex flex-col gap-5 rounded-lg border border-zinc-200 p-5"
                    key={section.slug}
                  >
                    <div className="flex flex-row items-center">
                      {section.icon}
                      <span className="ml-3 font-bold text-gray-800">
                        {dict.account.sections[section.slug].label}
                      </span>
                    </div>
                    {loading ? (
                      <Loader className="m-auto h-8 w-8" />
                    ) : value?.sections &&
                      value.sections[section.slug].length > 0 ? (
                      <div className="flex h-full flex-col justify-between">
                        <div className="flex flex-col gap-4">
                          {value.sections[section.slug]
                            .slice(0, MAX_PRODUCTS_PER_BLOCK)
                            .filter(({ key }) => key !== null)
                            .map(
                              ({
                                key,
                                link,
                                imageSrc,
                                title,
                                tag,
                                description,
                                price,
                              }) => (
                                <SmallCard
                                  key={key}
                                  imageSrc={imageSrc}
                                  title={title}
                                  tag={tag}
                                  description={description}
                                  price={price}
                                  link={link}
                                />
                              ),
                            )}
                        </div>
                        <Link
                          href={dict.account.sections[section.slug].action.link}
                          className="mt-5 w-full rounded-lg bg-gray-100 py-2.5 px-3 text-center text-sm font-semibold uppercase"
                        >
                          {dict.account.sections[section.slug].action.label}
                        </Link>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-sm">
                        <img
                          src="/empty-products.svg"
                          alt="no products"
                          className="w-[110px]"
                        />
                        <p className="mt-2 font-bold">
                          {dict.account.sections[section.slug].emptyTexts.title}
                        </p>
                        <p className="mt-2">
                          {
                            dict.account.sections[section.slug].emptyTexts
                              .description
                          }
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="col-start-1 col-end-13 lg:col-start-10">
            <AccountMenu />
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default Account;
