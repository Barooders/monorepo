'use client';

import { graphql } from '@/__generated/gql/admin';
import { useAuth } from '@/hooks/useAuth';
import useBackend from '@/hooks/useBackend';
import { useHasura } from '@/hooks/useHasura';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { useEffect, useState } from 'react';
import { useKeyPressEvent } from 'react-use';
import { HASURA_ROLES, SearchPublicVariantDocument } from 'shared-types';

const PRODUCT_HIT_QUERY = /* GraphQL */ /* typed_for_admin */ `
  query fetchProductHitData($productInternalId: String) {
    Product(where: { id: { _eq: $productInternalId } }) {
      manualNotation
    }
    dbt_store_product_for_analytics(
      where: { id: { _eq: $productInternalId } }
    ) {
      notation
      calculated_notation
      created_at
      calculated_scoring
    }
  }
`;

const AdminHitHelper = ({
  hit: { product_internal_id: productInternalId },
}: {
  hit: SearchPublicVariantDocument;
}) => {
  const { isAdmin } = useAuth();
  const fetchProductHitData = useHasura(
    graphql(PRODUCT_HIT_QUERY),
    HASURA_ROLES.ADMIN,
  );
  const [{ value }, doFetchProductHitData] = useWrappedAsyncFn(() =>
    fetchProductHitData({ productInternalId }),
  );

  useEffect(() => {
    if (!isAdmin()) return;
    doFetchProductHitData();
  }, []);

  const { fetchAPI } = useBackend();
  const [, doUpdateProduct] = useWrappedAsyncFn(
    async (updates: Record<string, string>) => {
      try {
        await fetchAPI(`/v1/admin/products/${productInternalId}`, {
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

  const [shouldShow, setShouldShow] = useState(false);
  useKeyPressEvent('?', () => {
    setShouldShow(!shouldShow);
  });

  const dbtProduct = value?.dbt_store_product_for_analytics[0];

  if (!isAdmin() || !dbtProduct || !shouldShow) return <></>;

  return (
    <div
      className="absolute z-10 bg-slate-200 bg-opacity-75 p-1 text-xs"
      data-ref="admin-hit-helper"
    >
      <p>
        {dbtProduct.calculated_scoring}/{dbtProduct.notation}/
        {dbtProduct.calculated_notation}
      </p>
      <p>{new Date(dbtProduct.created_at).toLocaleDateString('fr-FR')}</p>
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
