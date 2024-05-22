'use client';

import { graphql } from '@/__generated/gql/me_as_vendor';
import Button from '@/components/atoms/Button';
import Link from '@/components/atoms/Link';
import Loader from '@/components/atoms/Loader';
import Modal from '@/components/atoms/Modal';
import SmallCard from '@/components/atoms/SmallCard';
import VirtualizedTable from '@/components/atoms/VirtualizedTable';
import useBackend from '@/hooks/useBackend';
import { useHasura } from '@/hooks/useHasura';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { getDictionary } from '@/i18n/translate';
import { ProductStatus } from '@/types';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HASURA_ROLES } from 'shared-types';
import { mapProductFromGraphQl } from '../../_helpers/map-product';

const dict = getDictionary('fr');

const getDisplayedStatus = (status: ProductStatus) =>
  dict.account.productStatus[status] ?? dict.account.productStatus.unknown;

const STATUS_COLORS = {
  [ProductStatus.ACTIVE]: 'bg-green-100 text-green-800',
  [ProductStatus.DRAFT]: 'bg-gray-100 text-gray-800',
  [ProductStatus.ARCHIVED]: 'bg-gray-100 text-gray-800',
  unknown: 'bg-red-100 text-red-800',
};

type OnlineProduct = {
  title: string | null;
  tag: string | null;
  description: string;
  imageSrc: string | null;
  price: string;
  link: string;
  numberOfViews: number;
  status: ProductStatus;
  actions: {
    label: string;
    link?: string;
    updateProduct?: () => void;
  }[];
};

const FETCH_ONLINE_PRODUCTS = /* GraphQL */ /* typed_for_me_as_vendor */ `
  query fetchOnlineProducts {
    Customer(limit: 1) {
      onlineProducts(
        order_by: { createdAt: desc }
        where: {
          variants: { quantity: { _gte: 1 } }
          status: { _neq: "ARCHIVED" }
          salesChannels: { salesChannelName: { _eq: "PUBLIC" } }
        }
      ) {
        status
        id
        storeProduct: storeExposedProduct {
          handle
          productType
          numberOfViews
          size
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
          gender
          modelYear
          brand
          firstImage
        }
      }
    }
  }
`;

type OnlineProductState = Record<string, OnlineProduct>;

const OnlineProductsTable = () => {
  const [onlineProductsState, setOnlineProductsState] =
    useState<OnlineProductState>({});
  const fetchOnlineProducts = useHasura(
    graphql(FETCH_ONLINE_PRODUCTS),
    HASURA_ROLES.ME_AS_VENDOR,
  );
  const { fetchAPI } = useBackend();
  const getActionsFromStatus = (
    status: string | null,
    productInternalId: string,
  ) => {
    return [
      {
        label: dict.account.tables.actions.edit,
        link: `/selling-form/${productInternalId}`,
      },
      ...(status === ProductStatus.ACTIVE
        ? [
            {
              label: dict.account.tables.actions.pause,
              updateProduct: () => {
                updateProductStatus(productInternalId, ProductStatus.DRAFT);
              },
            },
          ]
        : [
            {
              label: dict.account.tables.actions.activate,
              updateProduct: () => {
                updateProductStatus(productInternalId, ProductStatus.ACTIVE);
              },
            },
          ]),
      {
        label: dict.account.tables.actions.delete,
        updateProduct: () => {
          updateProductStatus(productInternalId, ProductStatus.ARCHIVED);
        },
      },
    ];
  };

  const updateProductStatus = async (
    productInternalId: string,
    status: ProductStatus,
  ) => {
    const toastOptions = { duration: 3000 };
    try {
      await fetchAPI(`/v1/products/${productInternalId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          status,
        }),
      });
      setOnlineProductsState((previousState) => ({
        ...previousState,
        [productInternalId]: {
          ...previousState[productInternalId],
          status,
          actions: getActionsFromStatus(status, productInternalId),
        },
      }));
      toast.success(dict.catalog.update.successToaster, toastOptions);
    } catch (error) {
      toast.error(dict.catalog.update.errorToaster, toastOptions);
    }
  };

  const [{ loading, error, value }, doFetchOnlineProducts] = useWrappedAsyncFn(
    async () => {
      const { Customer } = await fetchOnlineProducts();
      if (Customer.length === 0) return {};

      const { onlineProducts } = Customer[0];

      return onlineProducts.reduce((acc: OnlineProductState, product) => {
        if (!product.storeProduct) return acc;

        const { status, storeProduct } = product;

        const { title, tag, description, imageSrc, price, link } =
          mapProductFromGraphQl(storeProduct);

        return {
          ...acc,
          [product.id]: {
            title,
            tag,
            description,
            imageSrc,
            link,
            price,
            status,
            numberOfViews: storeProduct.numberOfViews,
            actions: getActionsFromStatus(status, product.id),
          },
        };
      }, {});
    },
  );

  useEffect(() => {
    doFetchOnlineProducts();
  }, []);

  useEffect(() => {
    if (!value) return;

    setOnlineProductsState(value);
  }, [value]);

  return loading ? (
    <Loader className="m-auto h-8 w-8" />
  ) : error ? (
    <p className="text-red-600">{dict.global.errors.unknownError}</p>
  ) : value ? (
    <VirtualizedTable
      searchPlaceholder={dict.account.tables.searchPlaceholder.onlineProduct}
      width={1268}
      desktopRowHeight={61}
      mobileRowHeight={250}
      rows={Object.values(onlineProductsState).map(
        ({
          title,
          tag,
          description,
          imageSrc,
          price,
          status,
          link,
          numberOfViews,
          actions,
        }) => ({
          label: (
            <SmallCard
              title={title}
              tag={tag}
              description={description}
              imageSrc={imageSrc}
              link={link}
            />
          ),
          numberOfViews: numberOfViews.toString(),
          price,
          status: (
            <div
              className={`${STATUS_COLORS[status]} rounded px-1.5 py-1 font-semibold`}
            >
              {getDisplayedStatus(status)}
            </div>
          ),
          actions: (
            <div className="flex justify-end">
              {actions.map(({ label, link, updateProduct }) =>
                link ? (
                  <Link
                    className="mr-3 rounded bg-gray-100 px-3 py-2 font-semibold uppercase text-gray-800"
                    key={label}
                    href={link}
                  >
                    {label}
                  </Link>
                ) : (
                  updateProduct && (
                    <Modal
                      key={label}
                      ButtonComponent={({ openModal }) => (
                        <button
                          className="mr-3 rounded bg-gray-100 px-3 py-2 font-semibold uppercase text-gray-800"
                          type="button"
                          onClick={openModal}
                        >
                          {label}
                        </button>
                      )}
                      ContentComponent={({ closeModal }) => (
                        <div>
                          <p className="text-2xl font-bold">{label}</p>
                          <p className="mt-3 text-sm text-slate-600">
                            {dict.catalog.update.askForProductUpdateConfirmation(
                              label,
                            )}
                          </p>
                          <Button
                            className="mt-5 flex w-full justify-center py-3 text-sm font-medium uppercase"
                            type="submit"
                            onClick={() => {
                              closeModal();
                              updateProduct();
                            }}
                            intent="secondary"
                          >
                            {dict.catalog.update.yes}
                          </Button>
                          <Button
                            type="button"
                            className="mt-1 w-full py-3 text-sm font-medium uppercase"
                            onClick={closeModal}
                            intent="tertiary"
                          >
                            {dict.catalog.update.no}
                          </Button>
                        </div>
                      )}
                    />
                  )
                ),
              )}
            </div>
          ),
        }),
      )}
      columns={{
        desktopColumns: {
          label: {
            width: 400,
            label: dict.account.tables.columns.label,
          },
          numberOfViews: {
            width: 160,
            label: dict.account.tables.columns.numberOfViews,
          },
          price: {
            width: 130,
            label: dict.account.tables.columns.price,
          },
          status: {
            width: 130,
            label: dict.account.tables.columns.status,
          },
          actions: {
            width: 380,
            label: dict.account.tables.columns.actions,
          },
        },
        highlightedMobileColumns: ['status', 'label', 'actions'],
      }}
    />
  ) : (
    <></>
  );
};

export default OnlineProductsTable;
