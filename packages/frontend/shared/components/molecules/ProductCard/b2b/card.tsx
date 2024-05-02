import useOpenedOffersState from '@/components/pages/ProPage/_state/useOpenedOffersState';
import B2BPriceOfferButton, {
  ExistingOfferComponent,
} from '../_components/Actions/B2BPriceOfferButton';
import Characteristics from '../_components/Characteristics';
import ProductImage from '../_components/ProductImage';
import BundlePrice from '../_components/ProductPrice/BundlePrice';
import { B2BProductCardProps } from '../types';

const B2BProductCard: React.FC<
  B2BProductCardProps & { openDetails: (productInternalId: string) => void }
> = ({
  id,
  vendorId,
  title,
  tags,
  productType,
  variantCondition,
  price,
  compareAtPrice,
  largestBundlePrice,
  image,
  stock,
  openDetails,
  intent = 'card',
}) => {
  const { hasOpenedPriceOffer } = useOpenedOffersState();
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex flex-col gap-1">
        <div
          onClick={() => openDetails(id)}
          className={`relative ${intent === 'card' ? 'h-40 sm:h-64 xs:h-52' : 'h-32'} w-full cursor-pointer`}
        >
          {image && (
            <ProductImage
              image={image}
              labels={[]}
              discounts={[]}
            />
          )}
        </div>
        <Characteristics
          tags={tags}
          title={title}
          productType={productType}
          variantCondition={variantCondition}
          componentSize="medium"
          openDetails={() => openDetails(id)}
        />
        <BundlePrice
          className="my-1"
          compareAtPrice={compareAtPrice}
          price={price}
          largestBundlePrice={largestBundlePrice}
          stock={stock}
        />
      </div>

      {hasOpenedPriceOffer(id) ? (
        <ExistingOfferComponent className="flex-1" />
      ) : (
        <></>
      )}
      <B2BPriceOfferButton
        className="flex-1 !text-sm uppercase"
        productId={id}
        vendorId={vendorId}
        openDetails={openDetails}
      />
    </div>
  );
};

export default B2BProductCard;
