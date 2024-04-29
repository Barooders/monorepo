import { getDictionary } from '@/i18n/translate';
import ProductPrice from '.';
import ProductLabel from '../ProductLabel';

const dict = getDictionary('fr');

type PropsType = {
  shopifyId: string;
  compareAtPrice: number;
  largestBundlePrice?: number;
  price: number;
  stock: number;
  className?: string;
};

const BundlePrice: React.FC<PropsType> = ({
  shopifyId,
  compareAtPrice,
  largestBundlePrice,
  price,
  stock,
  className,
}) => {
  const bundlePrice = largestBundlePrice ?? price;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex gap-1">
        <p>{dict.b2b.productCard.price.quantities}:</p>
        <div className="w-fit">
          <ProductLabel
            label={{ content: stock.toString(), color: 'purple' }}
          />
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <span className="whitespace-nowrap font-bold">
            {dict.b2b.productCard.price.unitBundlePrice} :
          </span>
          <ProductPrice
            productId={shopifyId}
            discounts={[]}
            compareAtPrice={Math.max(compareAtPrice, price)}
            price={bundlePrice}
            showPriceRecap={false}
          />
        </div>
      </div>
    </div>
  );
};

export default BundlePrice;
