'use client';

import Link from '@/components/atoms/Link';
import { getDictionary } from '@/i18n/translate';
import { REVIEW_BLOCK_ANCHOR } from './container';
import ReviewStars from './ReviewStars';

const dict = getDictionary('fr');

type PropsType = {
  vendor: string;
  rating: number;
  className?: string;
  reviewCount: number;
  withSeeAllLink?: boolean;
};

const SmallReviewLink: React.FC<PropsType> = ({
  rating,
  vendor,
  className,
  reviewCount,
  withSeeAllLink = true,
}) => {
  return (
    <div className={`flex items-center gap-1 text-sm ${className}`}>
      <ReviewStars rating={rating} />
      <p className="text-slate-400">({reviewCount})</p>
      {withSeeAllLink && (
        <Link
          onClick={() => {
            const reviewContainer =
              document.getElementById(REVIEW_BLOCK_ANCHOR);
            if (!reviewContainer) {
              window.location.href = `/collections/vendor?q=${encodeURIComponent(
                vendor,
              )}`;
              return;
            }

            reviewContainer.scrollIntoView({ behavior: 'smooth' });
          }}
          className="font-semibold underline"
        >
          {dict.components.productCard.reviews.seeReviews}
        </Link>
      )}
    </div>
  );
};

export default SmallReviewLink;
