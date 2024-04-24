import Button from '@/components/atoms/Button';
import { getDictionary } from '@/i18n/translate';
import B2BPriceOfferButton from '../_components/Actions/B2BPriceOfferButton';
import Characteristics from '../_components/Characteristics';
import ProductImage from '../_components/ProductImage';
import BundlePrice from '../_components/ProductPrice/BundlePrice';
import { B2BProductCardProps } from '../types';

const dict = getDictionary('fr');

const ExistingOfferComponent: React.FC = () => {
  return (
    <Button
      disabled={true}
      intent="secondary"
      className="mt-2"
    >
      {dict.b2b.productCard.existingOffer}
    </Button>
  );
};

const B2BProductCard: React.FC<
  B2BProductCardProps & { openDetails: (productInternalId: string) => void }
> = ({
  id,
  shopifyId,
  title,
  tags,
  productType,
  variantCondition,
  price,
  compareAtPrice,
  largestBundlePrice,
  image,
  stock,
  hasOpenedPriceOffer,
  openDetails,
}) => {
  return (
    <div className="grid w-full grid-cols-2 gap-1 overflow-hidden border border-slate-50">
      <div className="relative col-span-2 h-52 w-full flex-grow sm:h-64">
        {image && (
          <ProductImage
            image={image}
            labels={[]}
            discounts={[]}
          />
        )}
      </div>
      <div className="relative col-span-2 my-auto flex flex-grow flex-col justify-between">
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
        <div className="flex flex-col">
          <BundlePrice
            className="my-1"
            compareAtPrice={compareAtPrice}
            price={price}
            shopifyId={shopifyId}
            largestBundlePrice={largestBundlePrice}
            stock={stock}
          />

          <div className="mt-2 flex flex-col gap-2">
            <div className="flex w-full gap-2">
              <div className="flex-1">
                {hasOpenedPriceOffer ? (
                  <ExistingOfferComponent />
                ) : (
                  <B2BPriceOfferButton
                    productId={id}
                    userCanNegociate={false}
                  />
                )}
              </div>
              <div className="flex-1">
                <Button
                  onClick={() => openDetails(id)}
                  intent="tertiary"
                  className="w-full"
                >
                  {dict.b2b.productCard.details}
                </Button>
              </div>
            </div>
            <B2BPriceOfferButton
              productId={id}
              userCanNegociate={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default B2BProductCard;
