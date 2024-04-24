import { FetchB2BProductQuery } from '@/__generated/graphql';
import { useHasura } from '@/hooks/useHasura';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { enrichTags } from '@/mappers/search';
import { roundCurrency } from '@/utils/currency';
import { gql } from '@apollo/client';
import first from 'lodash/first';
import { useEffect } from 'react';
import { HASURA_ROLES } from 'shared-types';
import { extractTags } from '../container';
import { B2BProductPanelProps } from '../types';
import ProductPanel from './panel';

export type ContainerPropsType = {
  productInternalId: string;
};

export const FETCH_B2B_PRODUCT = gql`
  query fetchB2BProduct($productInternalId: String) {
    dbt_store_base_product(where: { id: { _eq: $productInternalId } }) {
      id
      shopifyId
      product {
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
        variant {
          compareAtPrice
          title
          condition
          inventoryQuantity
          shopify_id
        }
        b2bVariant {
          price
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
  productResponse: FetchB2BProductQuery,
): B2BProductPanelProps => {
  const rawProduct = first(productResponse.dbt_store_base_product);

  if (!rawProduct) {
    throw new Error('Cannot find product');
  }

  const availableVariants = rawProduct.variants.filter(
    (variant) => variant.variant?.inventoryQuantity > 0,
  );

  const mainVariantRaw = first(
    availableVariants.length > 0 ? availableVariants : rawProduct.variants,
  );

  if (!rawProduct.b2bProduct || !rawProduct.product || !mainVariantRaw) {
    throw new Error('Product is missing key information');
  }

  const mainVariant = {
    ...mainVariantRaw.b2bVariant,
    ...mainVariantRaw.variant,
  };

  const stock = availableVariants.reduce(
    (totalStock, { variant }) => totalStock + (variant?.inventoryQuantity ?? 0),
    0,
  );

  return {
    compareAtPrice: mainVariant.compareAtPrice,
    handle: rawProduct.product.handle,
    id: rawProduct.id,
    productType: rawProduct.product.productType,
    price: mainVariant?.price,
    shopifyId: rawProduct.shopifyId,
    stock,
    title: rawProduct.product.title,
    tags: enrichTags(extractTags(rawProduct.tags)),
    variantCondition: mainVariant.condition,
    largestBundlePrice: roundCurrency(
      rawProduct.b2bProduct.largest_bundle_price_in_cents / 100,
    ),
    images: rawProduct.images.map((image) => image.src),
    description: rawProduct.product.description ?? '',
    isSoldOut: stock === 0,
    numberOfViews: rawProduct.product.numberOfViews,
  };
};

const ProductPanelWithContainer: React.FC<ContainerPropsType> = ({
  productInternalId,
}) => {
  const fetchB2BProduct = useHasura<FetchB2BProductQuery>(
    FETCH_B2B_PRODUCT,
    HASURA_ROLES.B2B_USER,
  );
  const [{ value }, doGetData] = useWrappedAsyncFn(fetchB2BProduct);

  useEffect(() => {
    doGetData({
      productInternalId: productInternalId,
    });
  }, [productInternalId]);

  const productCardProps = value ? mapToProps(value) : null;

  return <>{productCardProps && <ProductPanel {...productCardProps} />}</>;
};

export default ProductPanelWithContainer;
