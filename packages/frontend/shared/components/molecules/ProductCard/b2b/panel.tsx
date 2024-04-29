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

const dict = getDictionary('fr');

const B2BProductPanel: React.FC<B2BProductPanelProps> = ({
  id,
  shopifyId,
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
        shopifyId={shopifyId}
        largestBundlePrice={largestBundlePrice}
        stock={stock}
      />

      <ProductViews numberOfViews={numberOfViews} />

      <div className="flex w-full gap-2">
        {hasOpenedPriceOffer ? (
          <ExistingOfferComponent className="flex-1" />
        ) : (
          <>
            <B2BPriceOfferButton
              productId={id}
              userCanNegociate={false}
              className="flex-1"
            />
            <B2BPriceOfferButton
              productId={id}
              userCanNegociate={true}
              className="flex-1"
            />
          </>
        )}
      </div>

      <ProductDescription
        tags={tags}
        variantCondition={variantCondition}
        description={description}
        isTitle={false}
      />
    </div>
  );
};

export default B2BProductPanel;
