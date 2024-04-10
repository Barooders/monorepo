import { ProductDTO } from '@/clients/products';
import Avatar from '@/components/atoms/Avatar';
import Breadcrumbs from '@/components/atoms/Breadcrumbs';
import NoSSR from '@/components/atoms/NoSSR';
import PageContainer from '@/components/atoms/PageContainer';
import ProductCard from '@/components/molecules/ProductCard';
import ProductRecommendations from '@/components/molecules/ProductCard/_components/ProductRecommendations';
import { getAvailableOffers } from '@/components/molecules/ProductCard/_utils/offers';
import { BOTTOM_PAGE_PORTAL_ANCHOR } from '@/components/molecules/ProductCard/config';
import { ProductMultiVariants } from '@/components/molecules/ProductCard/types';
import Reviews from '@/components/molecules/Reviews';
import { REVIEW_BLOCK_ANCHOR } from '@/components/molecules/Reviews/container';
import { getDictionary } from '@/i18n/translate';
import AdminProductBanner from './_components/AdminProductBanner';
import DiscountInitializer from './_components/DiscountInitializer';
import OwnerProductBanner from './_components/OwnerProductBanner';

const dict = getDictionary('fr');

export type ProductCardProps = Omit<ProductMultiVariants, 'intent'>;

type PropsType = {
  productCardProps: ProductCardProps;
  productByHandle: ProductDTO | null;
};

const ProductPage: React.FC<PropsType> = ({
  productCardProps,
  productByHandle,
}) => {
  const breadcrumbs = productByHandle?.breadcrumbs ?? [];

  const availableOffers = getAvailableOffers(
    productCardProps.variantCondition,
    productCardProps.hasRefurbishedVariant,
    breadcrumbs,
  );

  return (
    <>
      <NoSSR>
        <AdminProductBanner productShopifyId={productCardProps.shopifyId} />
        <OwnerProductBanner {...productCardProps} />
      </NoSSR>

      <PageContainer>
        {breadcrumbs.length > 0 && (
          <Breadcrumbs
            elements={breadcrumbs.map((parentCollection) => ({
              handle: parentCollection.handle,
              link: `/collections/${parentCollection.handle}`,
              title: parentCollection.shortName ?? parentCollection.title ?? '',
            }))}
          />
        )}
        <DiscountInitializer />
        <ProductCard
          {...productCardProps}
          availableOffers={availableOffers}
          intent="page"
        />
        <div className="mt-5">
          <ProductRecommendations productCardProps={productCardProps} />
        </div>
        {productCardProps.reviews.length > 0 && (
          <div
            className="mt-8"
            id={REVIEW_BLOCK_ANCHOR}
          >
            <div>
              <p className="text-lg font-semibold">
                {dict.components.productCard.reviews.vendorTitle}
              </p>
              <div className="mt-4 flex w-full items-center gap-2">
                <Avatar
                  name={productCardProps.vendor.name}
                  profilePictureUrl={productCardProps.vendor.profilePicture}
                  className="w-14"
                />
                <div className="flex flex-col">
                  <p className="font-semibold">
                    {productCardProps.vendor.name}
                  </p>
                  <p className="text-sm text-slate-500">
                    {dict.components.productCard.reviews.vendorSince({
                      date: new Date(
                        productCardProps.vendor.createdAt ?? '',
                      ).toLocaleDateString(),
                    })}
                  </p>
                </div>
              </div>
            </div>
            <Reviews
              reviews={productCardProps.reviews}
              className="mt-4"
            />
          </div>
        )}
      </PageContainer>
      <div
        id={BOTTOM_PAGE_PORTAL_ANCHOR}
        className="inline"
      />
    </>
  );
};

export default ProductPage;
