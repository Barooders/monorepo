'use client';

import ProductJsonLd from '@/components/atoms/JsonLd/ProductJsonLd';
import config from '@/config/env';
import { getProductConfigFromShopifyTags } from '@/config/productAttributes';
import { getDictionary } from '@/i18n/translate';
import compact from 'lodash/compact';
import head from 'lodash/head';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FaEye } from 'react-icons/fa';
import { HiOutlineInformationCircle } from 'react-icons/hi2';
import Modal from '../../atoms/Modal';
import BuyButton from './_components/Actions/BuyButton';
import ConversationButton from './_components/Actions/ConversationButton';
import PriceOffferButton from './_components/Actions/PriceOffferButton';
import Characteristics from './_components/Characteristics';
import CommissionDetails from './_components/CommissionDetails';
import DeliveryInformation from './_components/Delivery';
import FavoriteButton from './_components/FavoriteButton';
import Guarantees from './_components/Guarantees';
import Offers from './_components/Offers';
import PaymentIcons from './_components/PaymentIcons';
import ProductDescription from './_components/ProductDescription';
import ProductGallery from './_components/ProductGallery';
import ProductPrice from './_components/ProductPrice';
import DiscountLabel from './_components/ProductPrice/DiscountLabel';
import ProductVendor from './_components/ProductVendor';
import SplittedPayments from './_components/SplittedPayments';
import StickyBarPayment from './_components/StickyBarPayment';
import Support from './_components/Support';
import VariantSelector from './_components/VariantSelector';
import { BOTTOM_PAGE_PORTAL_ANCHOR } from './config';
import { ProductSingleVariant } from './types';

const dict = getDictionary('fr');

const SINGLE_VARIANT_TITLE = 'Default Title';

const ProductPage: React.FC<ProductSingleVariant> = (product) => {
  const {
    id,
    shopifyId,
    images,
    vendor,
    title,
    labels,
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
          images.length > 0 && images[0]?.src
            ? { src: images[0]?.src }
            : undefined
        }
      />

      <div className="grid w-full grid-cols-5 items-start gap-5 overflow-hidden">
        <div className="relative col-span-5 w-full lg:col-span-3">
          {images && (
            <div className="relative h-96 w-full overflow-hidden sm:h-[450px]">
              <ProductGallery
                images={compact(images)}
                labels={labels}
                isSoldOut={isSoldOut}
              />
            </div>
          )}
          <div className="mt-2 lg:mt-7">
            <Guarantees vendor={vendor.name} />
          </div>
          <div className="mt-6 hidden lg:block">
            <ProductDescription
              tags={tags}
              variantCondition={variantCondition}
              description={description}
              isTitle={false}
            />
          </div>
        </div>
        <div className="col-span-5 my-auto flex h-full flex-grow flex-col lg:col-span-2 lg:gap-2">
          <div className="flex w-full justify-between">
            <div className="flex flex-col gap-2">
              <Characteristics
                tags={tags}
                title={title}
                productType={productType}
                variantCondition={variantCondition}
                componentSize="large"
              />
              {vendor.name && (
                <ProductVendor
                  vendor={vendor.name}
                  withLink={true}
                  rating={vendor.reviews.averageRating}
                  reviewCount={vendor.reviews.count}
                />
              )}
            </div>
            <div className="flex w-10 shrink-0 flex-col items-center">
              <div className="w-full cursor-pointer">
                <FavoriteButton
                  intent="secondary"
                  productId={shopifyId}
                />
              </div>
              {numberOfViews > 10 && (
                <div className="mt-1 flex w-full flex-col items-center rounded-full bg-slate-100 p-2 text-lg text-slate-500">
                  <FaEye />
                  <p className="mt-1 text-xs">{numberOfViews}</p>
                </div>
              )}
            </div>
          </div>
          {discounts && (
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
          <div className="my-1">
            <ProductPrice
              productId={shopifyId}
              compareAtPrice={compareAtPrice}
              price={price}
              commissionAmount={commissionAmount}
              componentSize="large"
              discounts={discounts}
            />
          </div>
          {price > 60 && (
            <div className="mt-3">
              <SplittedPayments price={price} />
            </div>
          )}

          {informativeComponent && (
            <div className="mt-3">
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
            </div>
          )}

          {(variants.length > 1 ||
            !head(variants)?.name?.includes(SINGLE_VARIANT_TITLE)) && (
            <div>
              <VariantSelector
                variants={variants}
                selectedVariantId={variantShopifyId ?? null}
                onSelectVariant={(variantId) => setSelectedVariant(variantId)}
              />
            </div>
          )}

          {!isSoldOut && (
            <div className="mt-6 flex w-full flex-col gap-3">
              <div className="grid w-full grid-cols-2 gap-2">
                {vendor.negociationMaxAmountPercent ? (
                  <>
                    <BuyButton
                      className="col-span-2"
                      variant={variantShopifyId}
                    />
                    <PriceOffferButton
                      className="col-span-1 uppercase"
                      price={price}
                      productId={id}
                      variant={variantId}
                      negociationMaxAmountPercent={
                        vendor.negociationMaxAmountPercent
                      }
                      shouldRedirectToChat={true}
                    />
                    <ConversationButton
                      className="col-span-1"
                      productId={shopifyId}
                    />
                  </>
                ) : (
                  <>
                    <BuyButton
                      className="col-span-2"
                      variant={variantShopifyId}
                    />
                    <ConversationButton
                      className="col-span-2"
                      productId={shopifyId}
                    />
                  </>
                )}
              </div>
              <PaymentIcons />
            </div>
          )}
          <div className="mt-6 block lg:hidden">
            <ProductDescription
              tags={tags}
              variantCondition={variantCondition}
              description={description}
              isTitle={true}
            />
          </div>
          <div className="mt-5">
            <DeliveryInformation
              variantId={variantShopifyId ?? ''}
              shipmentTimeframeSentence={vendor.shipmentTimeframeSentence}
            />
          </div>
          <div className="mt-2">
            <CommissionDetails isPro={vendor.isPro} />
          </div>
          {collections.find(
            (collection) => collection === config.collectionIds.bike,
          ) && (
            <div className="mt-2">
              <Support />
            </div>
          )}
          <div className="mt-2">
            <Offers
              product={product}
              availableOffers={availableOffers ?? []}
            />
          </div>
        </div>
      </div>
      {pageBottomElementRef &&
        !isSoldOut &&
        createPortal(
          <StickyBarPayment
            compareAtPrice={compareAtPrice}
            discounts={discounts}
            price={price}
            productId={shopifyId}
            productType={productType}
            variantCondition={variantCondition}
            tags={tags}
            title={title}
            variantId={variantShopifyId ?? ''}
          />,
          pageBottomElementRef,
        )}
    </>
  );
};

export default ProductPage;
