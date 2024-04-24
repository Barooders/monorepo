import Button from '@/components/atoms/Button';
import { getDictionary } from '@/i18n/translate';
import { formatCurrency } from '@/utils/currency';
import compact from 'lodash/compact';
import B2BPriceOfferButton from '../_components/Actions/B2BPriceOfferButton';
import Characteristics from '../_components/Characteristics';
import ProductDescription from '../_components/ProductDescription';
import ProductGallery from '../_components/ProductGallery';
import ProductLabel from '../_components/ProductLabel';
import ProductPrice from '../_components/ProductPrice';
import { B2BProductPanelProps } from '../types';
import ProductViews from '../_components/ProductViews';

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
  isSoldOut,
	numberOfViews
}) => {
  const shouldShowBothPrices =
    largestBundlePrice && largestBundlePrice < 0.96 * price;
  const bundlePrice = shouldShowBothPrices ? largestBundlePrice : price;
  return (
    <div className="grid w-full grid-cols-2 gap-1 overflow-hidden border border-slate-50">
      <div className="relative col-span-2 h-52 w-full flex-grow sm:h-64">
        {images && (
          <div className="relative h-96 w-full overflow-hidden sm:h-[450px]">
            <ProductGallery
              images={compact(
                images.map((imageSrc) => ({
                  src: imageSrc,
                  height: null,
                  width: null,
                  altText: '',
                })),
              )}
              labels={[]}
              isSoldOut={isSoldOut}
            />
          </div>
        )}
      </div>
      <div className="relative col-span-2 my-auto flex h-[230px] flex-grow flex-col justify-between">
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
          <div className="my-1">
            <div className="flex gap-1">
              <p>Unités par lot:</p>
              <div className="w-fit">
                <ProductLabel
                  label={{ content: stock.toString(), color: 'purple' }}
                />
              </div>
            </div>
            {shouldShowBothPrices && (
              <p>P.U.: {formatCurrency(price, { round: true })}€</p>
            )}
            <div className="flex items-center gap-1">
              <span className="font-bold">P.U. Lot:</span>
              <ProductPrice
                productId={shopifyId}
                discounts={[]}
                compareAtPrice={Math.max(compareAtPrice, price)}
                price={bundlePrice}
                showPriceRecap={false}
              />
            </div>
          </div>

					<ProductViews numberOfViews={numberOfViews} />

          {
            // TODO
            false ? (
              <ExistingOfferComponent />
            ) : (
              <div className="flex gap-2">
                <B2BPriceOfferButton
                  productId={id}
                  userCanNegociate={false}
                />
                <B2BPriceOfferButton
                  productId={id}
                  userCanNegociate={true}
                />
              </div>
            )
          }

          <ProductDescription
            tags={tags}
            variantCondition={variantCondition}
            description={description}
            isTitle={false}
          />
        </div>
      </div>
    </div>
  );
};

export default B2BProductPanel;
