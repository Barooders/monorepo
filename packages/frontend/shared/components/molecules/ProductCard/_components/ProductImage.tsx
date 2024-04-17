import { Discount, ImageType } from '@/types';
import { ProductMultiVariants } from '../types';
import ProductLabel from './ProductLabel';
import DiscountLabel from './ProductPrice/DiscountLabel';

const ProductImage: React.FC<{
  image: ImageType;
  labels: ProductMultiVariants['labels'];
  discounts: Discount[];
}> = ({ image, labels, discounts }) => (
  <>
    {!!image && (
      <img
        className="h-full w-full object-contain"
        src={image.src}
        alt={image.altText}
      />
    )}
    <div className="from-0% to-30% absolute bottom-0 left-0 right-0 top-0 bg-gradient-to-t from-black to-transparent opacity-25" />
    <div className="absolute left-2 top-2 md:left-3 md:top-3">
      {labels
        .filter((label) => label.position === 'left')
        .map((label, index) => (
          <ProductLabel
            label={label}
            key={index}
          />
        ))}
    </div>
    <div className="absolute right-2 top-2 md:right-3 md:top-3">
      {labels
        .filter((label) => label.position === 'right')
        .map((label, index) => (
          <ProductLabel
            label={label}
            key={index}
          />
        ))}
    </div>
    {discounts && (
      <div className="absolute bottom-5 left-0 flex flex-col-reverse items-start gap-2 md:bottom-7">
        {discounts.map((discount) => (
          <DiscountLabel
            key={discount.title}
            discount={discount}
            displayDetails={false}
            sticked={true}
          />
        ))}
      </div>
    )}
  </>
);

export default ProductImage;
