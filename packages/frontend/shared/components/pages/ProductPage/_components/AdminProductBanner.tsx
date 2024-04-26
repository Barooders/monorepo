'use client';

import { FetchProductNotationQuery } from '@/__generated/graphql';
import { operations } from '@/__generated/rest-schema';
import AdminBanner from '@/components/atoms/ActionsBanner/AdminBanner';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import { useAuth } from '@/hooks/useAuth';
import useBackend from '@/hooks/useBackend';
import { useHasura } from '@/hooks/useHasura';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { ProductStatus } from '@/types';
import { gql } from '@apollo/client';
import { useEffect } from 'react';
import { HASURA_ROLES } from 'shared-types';

const PRODUCT_NOTATION_QUERY = gql`
  query fetchProductNotation($productInternalId: String!) {
    Product(where: { id: { _eq: $productInternalId } }) {
      manualNotation
      source
      sourceUrl
    }
    dbt_store_product_for_analytics(
      where: { id: { _eq: $productInternalId } }
    ) {
      created_at
      vendor_notation
      calculated_notation
      calculated_notation_beta
      orders_count
      favorites_count
    }
  }
`;

const AdminProductBanner = ({
  productShopifyId,
  productInternalId,
}: {
  productShopifyId: string;
  productInternalId: string;
}) => {
  const { isAdmin } = useAuth();
  const fetchProductNotation = useHasura<FetchProductNotationQuery>(
    PRODUCT_NOTATION_QUERY,
    HASURA_ROLES.ADMIN,
  );
  const [{ value }, doFetchProductNotation] = useWrappedAsyncFn<
    () => Promise<FetchProductNotationQuery>
  >(() => fetchProductNotation({ productInternalId }));

  const { fetchAPI } = useBackend();
  const [, doUpdateProduct] = useWrappedAsyncFn(
    async (updates: Record<string, string>) => {
      try {
        await fetchAPI(`/v1/admin/products/${productShopifyId}`, {
          method: 'PATCH',
          body: JSON.stringify(updates),
        });
        alert('Product was successfully updated');
        location.reload();
      } catch (e) {
        alert(e);
      }
    },
  );

  const [productCommissionState, fetchProductCommission] = useWrappedAsyncFn(
    async () => {
      return await fetchAPI<
        operations['PayoutController_previewCommission']['responses']['default']['content']['application/json']
      >(
        `/v1/invoice/preview-commission?productInternalId=${productInternalId}`,
      );
    },
  );

  useEffect(() => {
    if (!isAdmin()) return;
    doFetchProductNotation();
    fetchProductCommission();
  }, []);

  return (
    <AdminBanner>
      <div className="flex items-center justify-center gap-2 text-xs">
        <div>
          <p>
            ID: {productShopifyId} (created at:{' '}
            {new Date(
              value?.dbt_store_product_for_analytics[0].created_at,
            ).toLocaleDateString('fr-FR')}
            )
          </p>
          <p>
            source: {value?.Product[0]?.source ?? '-'} -{' '}
            <a
              className="font-semibold text-gray-500 underline"
              href={`https://barooders-metabase.herokuapp.com/dashboard/34?product_id=${productShopifyId}`}
            >
              Perf
            </a>
          </p>
          {value?.Product[0]?.sourceUrl && (
            <a
              className="underline"
              target="_blank"
              href={value?.Product[0]?.sourceUrl}
              rel="noreferrer"
            >
              source product
            </a>
          )}
        </div>
        <Button
          className="text-xs"
          href={`/admin/products/${productShopifyId}`}
        >
          See
        </Button>
        <Button
          className="text-xs"
          onClick={() => doUpdateProduct({ status: ProductStatus.ARCHIVED })}
        >
          Archive
        </Button>
        <Select
          className="h-[33px] w-[140px]"
          buttonClassName="text-xs py-0 h-full"
          onSelect={(manualNotation) => doUpdateProduct({ manualNotation })}
          selectedOptionValue={value?.Product[0]?.manualNotation ?? '-'}
          options={['-', 'A', 'B', 'C'].map((notation) => ({
            label: `Notation: ${notation}`,
            value: notation,
          }))}
        />
        <div className="flex">
          <div className="flex flex-col">
            <p>manual_notation: {value?.Product[0]?.manualNotation ?? '-'}</p>
            <p>
              vendor_notation:{' '}
              {value?.dbt_store_product_for_analytics[0].vendor_notation ?? '-'}
            </p>
          </div>
          <div className="ml-5 flex flex-col">
            <p>
              calculated_notation:{' '}
              {value?.dbt_store_product_for_analytics[0].calculated_notation ??
                '-'}
            </p>
            <p>
              calculated_notation_beta:{' '}
              {value?.dbt_store_product_for_analytics[0]
                .calculated_notation_beta ?? '-'}
            </p>
          </div>
          <div className="ml-5 flex flex-col">
            <p>
              orders_count:{' '}
              {value?.dbt_store_product_for_analytics[0].orders_count ?? '-'}
            </p>
            <p>
              favorites_count:{' '}
              {value?.dbt_store_product_for_analytics[0].favorites_count ?? '-'}
            </p>
          </div>
          <div className="ml-5 flex flex-col">
            <p>
              vendor_commission:{' '}
              {productCommissionState.value?.vendorCommission
                ? (-1 * productCommissionState.value.vendorCommission).toFixed(
                    0,
                  )
                : '-'}{' '}
              €
            </p>
            <p>
              vendor_shipping:{' '}
              {productCommissionState.value?.vendorShipping.toFixed(0) ?? '-'} €
            </p>
          </div>
        </div>
        <Button
          className="ml-10 text-xs"
          href="https://barooders.retool.com/apps/a95e27ba-5d41-11ee-8b5b-f3f500dba9d6/Product%20management"
        >
          Retool Product
        </Button>
      </div>
    </AdminBanner>
  );
};

export default AdminProductBanner;
