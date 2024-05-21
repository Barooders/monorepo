'use client';
import { graphql as graphqlMeAsCustomer } from '@/__generated/gql/me_as_customer';
import { FetchAccountPageCustomerDataQuery } from '@/__generated/gql/me_as_customer/graphql';
import { graphql as graphqlMeAsVendor } from '@/__generated/gql/me_as_vendor';
import { FetchAccountPageVendorDataQuery } from '@/__generated/gql/me_as_vendor/graphql';
import Link from '@/components/atoms/Link';
import Loader from '@/components/atoms/Loader';
import PageContainer from '@/components/atoms/PageContainer';
import SmallCard from '@/components/atoms/SmallCard';
import { useAuth } from '@/hooks/useAuth';
import { useHasura } from '@/hooks/useHasura';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { getDictionary } from '@/i18n/translate';
import { useEffect } from 'react';
import { HASURA_ROLES } from 'shared-types';
import AccountMenu from './_components/AccountMenu';
import CustomerSection from './_components/CustomerSection';
import { mapProductFromGraphQl } from './_helpers/map-product';
import { MAX_PRODUCTS_PER_BLOCK, PRODUCTS_BY_SECTION } from './config';
import { OrderStatus } from './types';

const getDisplayedStatus = (status: string | null) => {
  if (!status) return dict.account.orderStatus.unknown.short;

  return (
    dict.account.orderStatus[status as OrderStatus].short ??
    dict.account.orderStatus.unknown.short
  );
};

const dict = getDictionary('fr');

const FETCH_ACCOUNT_PAGE_CUSTOMER_DATA = /* GraphQL */ /* typed_for_me_as_customer */ `
  query fetchAccountPageCustomerData($maxItems: Int) {
    Customer(limit: 1) {
      lastName
      firstName
      sellerName
      isPro
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
            firstImage
            handle
            productType
            size
            gender
            modelYear
            brand
            product {
              variants(order_by: { b2cVariant: { price: asc } }, limit: 1) {
                variant {
                  condition
                }
                b2cVariant {
                  price
                }
              }
            }
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

const FETCH_ACCOUNT_PAGE_VENDOR_DATA = /* GraphQL */ /* typed_for_me_as_vendor */ `
  query fetchAccountPageVendorData($maxItems: Int) {
    Customer(limit: 1) {
      onlineProducts(
        limit: $maxItems
        order_by: { createdAt: desc }
        where: {
          variants: { quantity: { _gte: 1 } }
          status: { _neq: "ARCHIVED" }
          salesChannels: { salesChannelName: { _eq: "PUBLIC" } }
        }
      ) {
        storeProduct: storeExposedProduct {
          firstImage
          handle
          productType
          size
          gender
          modelYear
          brand
          product {
            variants(order_by: { b2cVariant: { price: asc } }, limit: 1) {
              variant {
                condition
              }
              b2cVariant {
                price
              }
            }
          }
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
  key: string;
  link: string;
  tag: string;
  title: string;
  description: string;
  price: string;
  imageSrc: string | null;
}

const Account = () => {
  const { isB2BUser } = useAuth();
  const fetchAccountPageCustomerData = useHasura(
    graphqlMeAsCustomer(FETCH_ACCOUNT_PAGE_CUSTOMER_DATA),
    HASURA_ROLES.ME_AS_CUSTOMER,
  );

  const fetchAccountPageVendorData = useHasura(
    graphqlMeAsVendor(FETCH_ACCOUNT_PAGE_VENDOR_DATA),
    HASURA_ROLES.ME_AS_VENDOR,
  );

  const [{ loading, error, value }, doFetchAccountPageData] = useWrappedAsyncFn(
    async () => {
      const [
        {
          Customer: [
            {
              firstName,
              lastName,
              isPro,
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
          isPro,
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

              const {
                productBrand,
                name,
                productImage: imageSrc,
              } = firstProduct;

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
    },
  );

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
            <CustomerSection value={value} />
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
                          className="mt-5 w-full rounded-lg bg-gray-100 px-3 py-2.5 text-center text-sm font-semibold uppercase"
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
            <AccountMenu
              isProUser={value?.customer.isPro ?? false}
              isB2BUser={isB2BUser()}
            />
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default Account;
