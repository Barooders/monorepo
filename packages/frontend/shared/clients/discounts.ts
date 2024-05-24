import { graphql } from '@/__generated/gql/public';
import { GetAvailableDiscountsQuery } from '@/__generated/gql/public/graphql';
import { fetchHasura } from '@/clients/hasura';
import { DISCOUNTS_CONFIG } from '@/config/discounts';
import { Discount } from '@/types';
import compact from 'lodash/compact';

const FETCH_DISCOUNTS = /* GraphQL */ /* typed_for_public */ `
  query getAvailableDiscounts($discountTitles: [String!]) {
    dbt_store_discount(where: { title: { _in: $discountTitles } }) {
      collection {
        collection_internal_id
      }
      ends_at
      starts_at
      id
      value
      value_type
      code
      title
      min_amount
    }
  }
`;

const mapDiscount = (
  discount: GetAvailableDiscountsQuery['dbt_store_discount'][0],
): Discount | null => {
  const discountTitle = discount.title ?? '';
  const valueType = discount.value_type;
  if (
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    !valueType ||
    (valueType !== 'fixed_amount' && valueType !== 'percentage')
  ) {
    return null;
  }
  const discountConfig = DISCOUNTS_CONFIG.find(
    ({ title }) => title === discountTitle,
  );

  return {
    collections: discount.collection.map(({ collection_internal_id }) =>
      collection_internal_id.toString(),
    ),
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    endsAt: discount.ends_at ? new Date(discount.ends_at) : undefined,
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    startsAt: discount.starts_at ? new Date(discount.starts_at) : undefined,
    title: discountTitle,
    value: discount.value,
    valueType,
    code: discount.code ?? undefined,
    id: discount.id.toString(),
    label: discountConfig?.label ?? discountTitle,
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    hideReduction: !!discountConfig?.hideReduction,
    minAmount:
      typeof discount.min_amount === 'number' ? discount.min_amount : undefined,
    groupKey: discountConfig?.groupKey,
  };
};

export const fetchDiscountsByTitles = async (discountTitles: string[]) => {
  const discounts = await fetchHasura(graphql(FETCH_DISCOUNTS), {
    variables: { discountTitles },
  });

  return compact(discounts.dbt_store_discount.map(mapDiscount));
};
