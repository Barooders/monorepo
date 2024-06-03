'use client';

import ProductJsonLd from '@/components/atoms/JsonLd/ProductJsonLd';
import Modal from '@/components/atoms/Modal';
import ProductVendor from '@/components/molecules/ProductVendor';
import config from '@/config/env';
import { getProductConfigFromShopifyTags } from '@/config/productAttributes';
import { getDictionary } from '@/i18n/translate';
import compact from 'lodash/compact';
import head from 'lodash/head';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { HiOutlineInformationCircle } from 'react-icons/hi2';
import BuyButton from '../_components/Actions/BuyButton';
import PriceOfferButton from '../_components/Actions/PriceOfferButton';
import Characteristics from '../_components/Characteristics';
import DeliveryInformation from '../_components/Delivery';
import FavoriteButton from '../_components/FavoriteButton';
import { Guarantees } from '../_components/Guarantees';
import ProductDescription from '../_components/ProductDescription';
import ProductGallery from '../_components/ProductGallery';
import ProductPrice from '../_components/ProductPrice';
import DiscountLabel from '../_components/ProductPrice/DiscountLabel';
import { calculateFinalPrice } from '../_components/ProductPrice/lib';
import ProductViews from '../_components/ProductViews';
import SplittedPayments from '../_components/SplittedPayments';
import StickyBarPayment from '../_components/StickyBarPayment';
import Support from '../_components/Support';
import VariantSelector from '../_components/VariantSelector';
import { BOTTOM_PAGE_PORTAL_ANCHOR } from '../config';
import { ProductSingleVariant } from '../types';

const dict = getDictionary('fr');

const SINGLE_VARIANT_TITLE = 'Default Title';

const ProductPage: React.FC<ProductSingleVariant> = (product) => {
  const {
    id,
    productMerchantItemId,
    images,
    vendor,
    title,
    description,
    commissionAmount,
    tags,
    productType,
    variantCondition,
    variantId,
    variantShopifyId,
    price,
    compareAtPrice,
    setSelectedVariant,
    variants,
    numberOfViews,
    isSoldOut,
    productLink,
    availableOffers,
    discounts,
    collections,
  } = product;

  const [pageBottomElementRef, setPageBottomElementRef] =
    useState<HTMLElement | null>(null);

  useEffect(() => {
    setPageBottomElementRef(document.getElementById(BOTTOM_PAGE_PORTAL_ANCHOR));
  });

  const productAttributeConfig = getProductConfigFromShopifyTags(
    Object.keys(tags),
  );
  const informativeComponent = productAttributeConfig.find(
    (productAttribute) => productAttribute.informativeComponent,
  )?.informativeComponent;

  const renderDescription = () => (
    <div className="flex flex-col gap-10">
      <Guarantees availableOffers={availableOffers} />
      <ProductDescription
        tags={tags}
        variantCondition={variantCondition}
        description={description}
        isTitle={false}
      />
    </div>
  );

  const firstVariant = head(variants);

  const hasVariants =
    firstVariant !== undefined &&
    !firstVariant.name.includes(SINGLE_VARIANT_TITLE);

  return (
    <>
      <ProductJsonLd
        brand={tags.marque ?? vendor}
        description={description ?? ''}
        link={productLink}
        isSoldOut={isSoldOut}
        price={price}
        title={title}
        image={
          images.length > 0 && images[0] !== null
            ? { src: images[0].src }
            : undefined
        }
      />

      <div className="grid w-full grid-cols-5 items-start gap-5 overflow-hidden">
        <div className="relative col-span-5 flex w-full flex-col gap-5 lg:col-span-3">
          {images.length > 0 && (
            <div className="relative h-96 w-full overflow-hidden sm:h-[450px]">
              <ProductGallery
                images={compact(images)}
                labels={[]}
                isSoldOut={isSoldOut}
              />
            </div>
          )}
          <div className="hidden w-full lg:flex">{renderDescription()}</div>
        </div>
        <div className="col-span-5 my-auto flex h-full flex-grow flex-col gap-6 lg:col-span-2">
          <div className="flex flex-col gap-2">
            <Characteristics
              tags={tags}
              title={title}
              productType={productType}
              variantCondition={variantCondition}
              componentSize="large"
            />
            {vendor.name !== null && (
              <ProductVendor
                vendor={vendor.name}
                withLink={true}
                rating={vendor.reviews.averageRating}
                reviewCount={vendor.reviews.count}
                productInternalId={id}
                size="card"
                isPro={vendor.isPro}
              />
            )}
          </div>

          {discounts.length > 0 && (
            <div className="my-2 flex gap-2">
              {discounts.map((discount) => (
                <DiscountLabel
                  key={discount.title}
                  discount={discount}
                  displayDetails={true}
                  sticked={false}
                />
              ))}
            </div>
          )}
          <ProductPrice
            productInternalId={id}
            compareAtPrice={compareAtPrice}
            price={price}
            commissionAmount={commissionAmount}
            componentSize="large"
            discounts={discounts}
          />
          {price > 60 && (
            <SplittedPayments
              price={calculateFinalPrice(discounts, price, commissionAmount)}
            />
          )}

          {informativeComponent !== undefined && (
            <Modal
              ButtonComponent={({ openModal }) => (
                <div
                  className="flex cursor-pointer items-center gap-1 text-sm text-gray-500 underline"
                  onClick={openModal}
                >
                  {dict.components.productCard.sizeGuide}{' '}
                  <HiOutlineInformationCircle />
                </div>
              )}
              ContentComponent={() => <>{informativeComponent}</>}
            />
          )}

          <div className="flex flex-col gap-3">
            <ProductViews numberOfViews={numberOfViews} />

            {variants.length > 1 ||
              (hasVariants && (
                <div>
                  <VariantSelector
                    variants={variants}
                    selectedVariantId={variantId}
                    onSelectVariant={(variantId) =>
                      setSelectedVariant(variantId)
                    }
                  />
                </div>
              ))}

            {!isSoldOut && (
              <div className="flex w-full flex-col gap-3">
                <div className="flex gap-2">
                  {vendor.negociationMaxAmountPercent !== null && (
                    <PriceOfferButton
                      className="flex-1 uppercase"
                      price={price}
                      productInternalId={id}
                      variantInternalId={variantId}
                      negociationMaxAmountPercent={
                        vendor.negociationMaxAmountPercent
                      }
                      shouldRedirectToChat={true}
                    />
                  )}
                  <BuyButton
                    className="flex-1"
                    variantInternalId={variantId}
                    productMerchantItemId={productMerchantItemId}
                  />
                  <FavoriteButton
                    intent="square"
                    internalProductId={id}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <DeliveryInformation
              variantShopifyId={variantShopifyId ?? ''}
              shipmentTimeframeSentence={vendor.shipmentTimeframeSentence}
            />
            {collections.some(
              (collection) => collection === config.collectionIds.bike,
            ) && <Support productPrice={price} />}
          </div>
          <div className="flex lg:hidden">{renderDescription()}</div>
        </div>
      </div>
      {pageBottomElementRef &&
        !isSoldOut &&
        createPortal(
          <StickyBarPayment
            compareAtPrice={compareAtPrice}
            discounts={discounts}
            price={price}
            productInternalId={id}
            productMerchantItemId={productMerchantItemId}
            productType={productType}
            variantCondition={variantCondition}
            tags={tags}
            title={title}
            variantInternalId={variantId}
          />,
          pageBottomElementRef,
        )}
    </>
  );
};

export default ProductPage;
