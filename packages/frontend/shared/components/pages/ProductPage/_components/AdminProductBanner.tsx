'use client';

import { FetchProductNotationQuery } from '@/__generated/graphql';
import AdminBanner from '@/components/atoms/ActionsBanner/AdminBanner';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import { HASURA_ROLES } from '@/config';
import { useAuth } from '@/hooks/useAuth';
import useBackend from '@/hooks/useBackend';
import { useHasura } from '@/hooks/useHasura';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { ProductStatus } from '@/types';
import { gql } from '@apollo/client';
import { useEffect } from 'react';

const PRODUCT_NOTATION_QUERY = gql`
  query fetchProductNotation($productShopifyId: bigint) {
    Product(where: { shopifyId: { _eq: $productShopifyId } }) {
      manualNotation
      source
      sourceUrl
    }
    dbt_store_product_for_analytics(
      where: { shopify_id: { _eq: $productShopifyId } }
    ) {
      created_at
      vendor_notation
      calculated_notation
      calculated_notation_beta
    }
  }
`;

const AdminProductBanner = ({
  productShopifyId,
}: {
  productShopifyId: string;
}) => {
  const { isAdmin } = useAuth();
  const fetchProductNotation = useHasura<FetchProductNotationQuery>(
    PRODUCT_NOTATION_QUERY,
    HASURA_ROLES.ADMIN,
  );
  const [{ value }, doFetchProductNotation] = useWrappedAsyncFn<
    () => Promise<FetchProductNotationQuery>
  >(() => fetchProductNotation({ productShopifyId }));

  useEffect(() => {
    if (!isAdmin()) return;
    doFetchProductNotation();
  }, []);

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
  return (
    <AdminBanner>
      <div>
        <p>
          ID: {productShopifyId} (created at:{' '}
          {new Date(
            value?.dbt_store_product_for_analytics[0].created_at,
          ).toLocaleDateString('fr-FR')}
          )
        </p>
        <p className="text-xs">
          source: {value?.Product[0]?.source ?? '-'} -{' '}
          <a
            href={`https://barooders-metabase.herokuapp.com/dashboard/34?product_id=${productShopifyId}`}
          >
            Perf
          </a>
        </p>
        {value?.Product[0]?.sourceUrl && (
          <a
            className="text-xs underline"
            target="_blank"
            href={value?.Product[0]?.sourceUrl}
            rel="noreferrer"
          >
            source product
          </a>
        )}
      </div>
      <Button href={`/admin/products/${productShopifyId}`}>See</Button>
      <Button
        onClick={() => doUpdateProduct({ status: ProductStatus.ARCHIVED })}
      >
        Archive
      </Button>
      <Select
        className="w-[140px]"
        onSelect={(manualNotation) => doUpdateProduct({ manualNotation })}
        selectedOptionValue={value?.Product[0]?.manualNotation ?? '-'}
        options={['-', 'A', 'B', 'C'].map((notation) => ({
          label: `Notation: ${notation}`,
          value: notation,
        }))}
      />
      <div className="flex">
        <div className="flex flex-col">
          <p className="text-xs">
            manual_notation: {value?.Product[0]?.manualNotation ?? '-'}
          </p>
          <p className="text-xs">
            vendor_notation:{' '}
            {value?.dbt_store_product_for_analytics[0].vendor_notation ?? '-'}
          </p>
        </div>
        <div className="ml-5 flex flex-col">
          <p className="text-xs">
            calculated_notation:{' '}
            {value?.dbt_store_product_for_analytics[0].calculated_notation ??
              '-'}
          </p>
          <p className="text-xs">
            calculated_notation_beta:{' '}
            {value?.dbt_store_product_for_analytics[0]
              .calculated_notation_beta ?? '-'}
          </p>
        </div>
      </div>
      <Button
        className="ml-10"
        href="https://barooders.retool.com/apps/a95e27ba-5d41-11ee-8b5b-f3f500dba9d6/Product%20management"
      >
        Retool: Product Management
      </Button>
    </AdminBanner>
  );
};

export default AdminProductBanner;
