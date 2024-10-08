'use client';

import { graphql } from '@/__generated/gql/admin';
import { operations } from '@/__generated/rest-schema';
import AdminBanner from '@/components/atoms/ActionsBanner/AdminBanner';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import { useAuth } from '@/hooks/useAuth';
import useBackend from '@/hooks/useBackend';
import { useHasura } from '@/hooks/useHasura';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { ProductStatus } from '@/types';
import { useEffect, useState } from 'react';
import { useKeyPressEvent } from 'react-use';
import { HASURA_ROLES } from 'shared-types';

const PRODUCT_NOTATION_QUERY = /* GraphQL */ /* typed_for_admin */ `
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
  productInternalId,
  showByDefault = true,
  market = 'PUBLIC',
}: {
  productInternalId: string;
  showByDefault?: boolean;
  market?: 'PUBLIC' | 'B2B';
}) => {
  const { isAdmin } = useAuth();
  const fetchProductNotation = useHasura(
    graphql(PRODUCT_NOTATION_QUERY),
    HASURA_ROLES.ADMIN,
  );
  const [{ value: productValue }, doFetchProductNotation] = useWrappedAsyncFn(
    () => fetchProductNotation({ productInternalId }),
  );

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

  const [{ value: commissionValue }, fetchProductCommission] =
    useWrappedAsyncFn(async () => {
      return await fetchAPI<
        operations['PayoutController_previewCommission']['responses']['default']['content']['application/json']
      >(
        `/v1/invoice/preview-commission?productInternalId=${productInternalId}`,
      );
    });

  useEffect(() => {
    if (!isAdmin()) return;
    doFetchProductNotation();
    fetchProductCommission();
  }, []);

  const [shouldShow, setShouldShow] = useState(showByDefault);
  useKeyPressEvent('?', () => {
    setShouldShow(!shouldShow);
  });

  if (!shouldShow) return <></>;

  return (
    <AdminBanner>
      <div className="flex items-center justify-center gap-2 text-xs">
        <div>
          <p>
            ID: {productInternalId} (created at:{' '}
            {new Date(
              productValue?.dbt_store_product_for_analytics[0].created_at,
            ).toLocaleDateString('fr-FR')}
            )
          </p>
          <p>
            source: {productValue?.Product[0]?.source ?? '-'} -{' '}
            <a
              className="font-semibold text-gray-500 underline"
              href={`https://barooders-metabase.herokuapp.com/dashboard/34?product_id=${productInternalId}`}
            >
              Perf
            </a>
          </p>
          {productValue?.Product[0]?.sourceUrl && (
            <a
              className="underline"
              target="_blank"
              href={productValue?.Product[0]?.sourceUrl}
              rel="noreferrer"
            >
              source product
            </a>
          )}
        </div>
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
          selectedOptionValue={productValue?.Product[0]?.manualNotation ?? '-'}
          options={['-', 'A', 'B', 'C'].map((notation) => ({
            label: `Notation: ${notation}`,
            value: notation,
          }))}
        />
        <div className="flex">
          <div className="flex flex-col">
            <p>
              manual_notation: {productValue?.Product[0]?.manualNotation ?? '-'}
            </p>
            <p>
              vendor_notation:{' '}
              {productValue?.dbt_store_product_for_analytics[0]
                .vendor_notation ?? '-'}
            </p>
          </div>
          <div className="ml-5 flex flex-col">
            <p>
              calculated_notation:{' '}
              {productValue?.dbt_store_product_for_analytics[0]
                .calculated_notation ?? '-'}
            </p>
            <p>
              calculated_notation_beta:{' '}
              {productValue?.dbt_store_product_for_analytics[0]
                .calculated_notation_beta ?? '-'}
            </p>
          </div>
          <div className="ml-5 flex flex-col">
            <p>
              orders_count:{' '}
              {productValue?.dbt_store_product_for_analytics[0].orders_count ??
                '-'}
            </p>
            <p>
              favorites_count:{' '}
              {productValue?.dbt_store_product_for_analytics[0]
                .favorites_count ?? '-'}
            </p>
          </div>
          <div className="ml-5 flex flex-col">
            <p>
              commissions:{' '}
              {commissionValue
                ? (
                    commissionValue.buyerCommission -
                    commissionValue.vendorCommission
                  ) //vendorCommission is a negative number
                    .toFixed(0)
                : '-'}{' '}
              €
            </p>
            <p>
              vendor_shipping:{' '}
              {commissionValue?.vendorShipping.toFixed(0) ?? '-'} €
            </p>
          </div>
        </div>
        <Button
          className="ml-10 text-xs"
          href={`https://barooders.retool.com/apps/a95e27ba-5d41-11ee-8b5b-f3f500dba9d6/Product%20management?product_id=${productInternalId}&market=${market}`}
        >
          Retool Product
        </Button>
      </div>
    </AdminBanner>
  );
};

export default AdminProductBanner;
