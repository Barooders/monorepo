'use client';

import { HASURA_ROLES } from '@/config';
import { useAuth } from '@/hooks/useAuth';
import useBackend from '@/hooks/useBackend';
import { useHasura } from '@/hooks/useHasura';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { HitSearchType } from '@/types';
import { FetchProductHitDataQuery } from '@/__generated/graphql';
import { gql } from '@apollo/client';
import { useEffect } from 'react';

const PRODUCT_HIT_QUERY = gql`
  query fetchProductHitData($productId: String) {
    Product(where: { id: { _eq: $productId } }) {
      manualNotation
    }
    dbt_store_product_for_analytics(where: { id: { _eq: $productId } }) {
      vendor_notation
      calculated_notation
      calculated_notation_beta
      views_last_30_days
      created_at
      calculated_scoring
    }
  }
`;

const AdminHitHelper = ({
  hit: { product_internal_id: productId, product_shopify_id: productShopifyId },
}: {
  hit: HitSearchType;
}) => {
  const { isAdmin } = useAuth();
  const fetchProductHitData = useHasura<FetchProductHitDataQuery>(
    PRODUCT_HIT_QUERY,
    HASURA_ROLES.ADMIN,
  );
  const [{ value }, doFetchProductHitData] = useWrappedAsyncFn<
    () => Promise<FetchProductHitDataQuery>
  >(() => fetchProductHitData({ productId }));

  useEffect(() => {
    if (!isAdmin()) return;
    doFetchProductHitData();
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

  if (!isAdmin() || !value) return <></>;

  return (
    <div
      className="absolute z-10 bg-slate-200 bg-opacity-75 p-1 text-xs"
      data-ref="admin-hit-helper"
    >
      <p>
        (ranking scoring:{' '}
        {value?.dbt_store_product_for_analytics[0].calculated_scoring})
      </p>
      <p>- 1. manual_notation: {value?.Product[0]?.manualNotation ?? '-'}</p>
      <p>
        - 2. vendor_notation:{' '}
        {value?.dbt_store_product_for_analytics[0].vendor_notation ?? '-'}
      </p>
      <p>
        - 3. calculated_notation:{' '}
        {value?.dbt_store_product_for_analytics[0].calculated_notation ?? '-'}
      </p>
      <p>
        - 4. calculated_notation_beta:{' '}
        {value?.dbt_store_product_for_analytics[0].calculated_notation_beta ??
          '-'}
      </p>
      <p>
        - views_30_days:{' '}
        {value?.dbt_store_product_for_analytics[0].views_last_30_days}
      </p>
      <p>
        - created_at:{' '}
        {new Date(
          value?.dbt_store_product_for_analytics[0].created_at,
        ).toLocaleDateString('fr-FR')}
      </p>
      <select
        className="text-xs"
        onChange={(value) => {
          doUpdateProduct({ manualNotation: value.target.value });
        }}
        defaultValue={value?.Product[0]?.manualNotation ?? '-'}
      >
        <option value="-">-</option>
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="C">C</option>
      </select>
    </div>
  );
};

export default AdminHitHelper;
