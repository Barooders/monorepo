'use client';

import LinkWrapper from '@/components/atoms/Link/LinkWrapper';
import { getDictionary } from '@/i18n/translate';
import ReviewStars from './ReviewStars';
import { REVIEW_BLOCK_ANCHOR } from './container';

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
    <LinkWrapper
      shouldWrap={withSeeAllLink}
      onClick={() => {
        const reviewContainer = document.getElementById(REVIEW_BLOCK_ANCHOR);
        if (!reviewContainer) {
          window.location.href = `/collections/vendor?q=${encodeURIComponent(
            vendor,
          )}`;
          return;
        }

        reviewContainer.scrollIntoView({ behavior: 'smooth' });
      }}
      className={`flex items-center gap-1 text-xs font-semibold ${className}`}
    >
      <p>
        {reviewCount} {dict.components.productCard.reviews.reviews}
      </p>
      <div>·</div>
      <ReviewStars
        className="text-sm"
        rating={rating}
      />
    </LinkWrapper>
  );
};

export default SmallReviewLink;
