import { graphql } from '@/__generated/gql/b2b_user';
import { FetchB2BProductQuery } from '@/__generated/gql/b2b_user/graphql';
import Loader from '@/components/atoms/Loader';
import useOpenedOffersState from '@/components/pages/ProPage/_state/useOpenedOffersState';
import { useHasura } from '@/hooks/useHasura';
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
  openDetails: (productInternalId: string) => void;
};

export const FETCH_B2B_PRODUCT = /* GraphQL */ /* typed_for_b2b_user */ `
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
  productResponse: FetchB2BProductQuery,
  hasOpenedPriceOffer: boolean,
): Omit<B2BProductPanelProps, 'openDetails'> => {
  const rawProduct = first(productResponse.dbt_store_base_product);

  if (!rawProduct) {
    throw new Error('Cannot find product');
  }

  const availableVariants = rawProduct.variants.filter(
    (variant) => variant.exposedVariant?.inventory_quantity ?? 0 > 0,
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
    stock,
    title: rawProduct.exposedProduct.title,
    tags: enrichTags(extractTags(rawProduct.tags)),
    variantCondition: mainVariant.condition,
    ...(rawProduct.b2bProduct.largest_bundle_price_in_cents !== null && {
      largestBundlePrice: roundCurrency(
        rawProduct.b2bProduct.largest_bundle_price_in_cents / 100,
      ),
    }),
    images: rawProduct.images.map((image) => image.src),
    description: rawProduct.exposedProduct.description ?? '',
    isSoldOut: stock === 0,
    numberOfViews: rawProduct.exposedProduct.numberOfViews,
    hasOpenedPriceOffer,
    vendorId: rawProduct.vendorId,
  };
};

const ProductPanelWithContainer: React.FC<ContainerPropsType> = ({
  productInternalId,
  openDetails,
}) => {
  const fetchB2BProduct = useHasura(
    graphql(FETCH_B2B_PRODUCT),
    HASURA_ROLES.B2B_USER,
  );
  const [{ value, loading }, doGetData] = useWrappedAsyncFn(fetchB2BProduct);
  const { hasOpenedPriceOffer } = useOpenedOffersState();

  useEffect(() => {
    doGetData({
      productInternalId: productInternalId,
    });
  }, [productInternalId]);

  const productCardProps = value
    ? mapToProps(value, hasOpenedPriceOffer(productInternalId))
    : null;

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        productCardProps && (
          <ProductPanel
            {...productCardProps}
            openDetails={openDetails}
          />
        )
      )}
    </>
  );
};

export default ProductPanelWithContainer;
