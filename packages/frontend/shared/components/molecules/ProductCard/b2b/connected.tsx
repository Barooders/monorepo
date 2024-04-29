import { B2BUserTypes } from '@/__generated/hasura-role-graphql.types';
import Loader from '@/components/atoms/Loader';
import { gql_b2b_user, useHasura } from '@/hooks/useHasura';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { enrichTags } from '@/mappers/search';
import { roundCurrency } from '@/utils/currency';
import first from 'lodash/first';
import { useEffect } from 'react';
import { HASURA_ROLES } from 'shared-types';
import { extractTags } from '../container';
import { B2BProductPanelProps } from '../types';
import ProductPanel from './panel';

export type ContainerPropsType = {
  productInternalId: string;
  hasOpenedPriceOffer: boolean;
};

export const FETCH_B2B_PRODUCT = gql_b2b_user`
  query fetchB2BProduct($productInternalId: String) {
    dbt_store_base_product(where: { id: { _eq: $productInternalId } }) {
      id
      shopifyId
      exposedProduct: product {
        model
        description
        numberOfViews
        brand
        handle
        id
        productType
        title
      }
      b2bProduct {
        largest_bundle_price_in_cents
      }
      images(limit: 10) {
        src
      }
      variants(limit: 10) {
        exposedVariant: variant {
          title
          condition
          inventory_quantity
        }
        b2bVariant {
          price
          compare_at_price
        }
      }
      tags {
        tag
        value
      }
      vendorId
    }
  }
`;

export const mapToProps = (
  productResponse: B2BUserTypes.FetchB2BProductQuery,
  hasOpenedPriceOffer: boolean,
): B2BProductPanelProps => {
  const rawProduct = first(productResponse.dbt_store_base_product);

  if (!rawProduct) {
    throw new Error('Cannot find product');
  }

  const availableVariants = rawProduct.variants.filter(
    (variant) => variant.exposedVariant?.inventory_quantity > 0,
  );

  const mainVariantRaw = first(
    availableVariants.length > 0 ? availableVariants : rawProduct.variants,
  );

  if (!rawProduct.b2bProduct || !rawProduct.exposedProduct || !mainVariantRaw) {
    throw new Error('Product is missing key information');
  }

  const mainVariant = {
    ...mainVariantRaw.b2bVariant,
    ...mainVariantRaw.exposedVariant,
  };

  const stock = availableVariants.reduce(
    (totalStock, { exposedVariant }) =>
      totalStock + (exposedVariant?.inventory_quantity ?? 0),
    0,
  );

  return {
    compareAtPrice: mainVariant.compare_at_price,
    handle: rawProduct.exposedProduct.handle,
    id: rawProduct.id,
    productType: rawProduct.exposedProduct.productType,
    price: mainVariant?.price,
    shopifyId: rawProduct.shopifyId,
    stock,
    title: rawProduct.exposedProduct.title,
    tags: enrichTags(extractTags(rawProduct.tags)),
    variantCondition: mainVariant.condition,
    largestBundlePrice: roundCurrency(
      rawProduct.b2bProduct.largest_bundle_price_in_cents / 100,
    ),
    images: rawProduct.images.map((image) => image.src),
    description: rawProduct.exposedProduct.description ?? '',
    isSoldOut: stock === 0,
    numberOfViews: rawProduct.exposedProduct.numberOfViews,
    hasOpenedPriceOffer,
  };
};

const ProductPanelWithContainer: React.FC<ContainerPropsType> = ({
  productInternalId,
  hasOpenedPriceOffer,
}) => {
  const fetchB2BProduct = useHasura<B2BUserTypes.FetchB2BProductQuery>(
    FETCH_B2B_PRODUCT,
    HASURA_ROLES.B2B_USER,
  );
  const [{ value, loading }, doGetData] = useWrappedAsyncFn(fetchB2BProduct);

  useEffect(() => {
    doGetData({
      productInternalId: productInternalId,
    });
  }, [productInternalId]);

  const productCardProps = value
    ? mapToProps(value, hasOpenedPriceOffer)
    : null;

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        productCardProps && <ProductPanel {...productCardProps} />
      )}
    </>
  );
};

export default ProductPanelWithContainer;
