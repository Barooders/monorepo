import { getDictionary } from '@/i18n/translate';
import first from 'lodash/first';
import B2BPriceOfferButton, {
  ExistingOfferComponent,
} from '../_components/Actions/B2BPriceOfferButton';
import Characteristics from '../_components/Characteristics';
import ProductDescription from '../_components/ProductDescription';
import ProductImage from '../_components/ProductImage';
import BundlePrice from '../_components/ProductPrice/BundlePrice';
import ProductViews from '../_components/ProductViews';
import { B2BProductPanelProps } from '../types';
import B2BProductsFromSameVendor from './ProductsFromSameVendor';

const dict = getDictionary('fr');

const B2BProductPanel: React.FC<B2BProductPanelProps> = ({
  id,
  title,
  tags,
  productType,
  variantCondition,
  price,
  compareAtPrice,
  largestBundlePrice,
  images,
  stock,
  description,
  numberOfViews,
  hasOpenedPriceOffer,
  vendorId,
  openDetails,
}) => {
  const firstImage = first(images);
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="relative h-52 w-full flex-grow">
        {firstImage && (
          <ProductImage
            image={{
              src: firstImage,
              height: null,
              width: null,
              altText: '',
            }}
            discounts={[]}
            labels={[]}
          />
        )}
      </div>
      <Characteristics
        tags={tags}
        title={title}
        productType={productType}
        variantCondition={variantCondition}
        componentSize="medium"
        extraTagKeys={[
          { key: 'couleur', label: dict.components.productCard.colorLabel },
        ]}
      />
      <BundlePrice
        compareAtPrice={compareAtPrice}
        price={price}
        largestBundlePrice={largestBundlePrice}
        stock={stock}
      />

      <ProductViews numberOfViews={numberOfViews} />

      {hasOpenedPriceOffer ? (
        <ExistingOfferComponent className="flex-1" />
      ) : (
        <> </>
      )}
      <B2BPriceOfferButton
        className="flex-1"
        productId={id}
        vendorId={vendorId}
        openDetails={openDetails}
      />

      <ProductDescription
        tags={tags}
        variantCondition={variantCondition}
        description={description}
        isTitle={false}
      />

      <B2BProductsFromSameVendor
        vendorId={vendorId}
        openDetails={openDetails}
      />
    </div>
  );
};

export default B2BProductPanel;
