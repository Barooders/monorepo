'use client';

import { getDictionary } from '@/i18n/translate';
import Avatar from '@/components/atoms/Avatar';
import { calculateAverageRatings } from '@/utils/rating';
import { ProductMultiVariants } from '../ProductCard/types';
import ReviewStars from './ReviewStars';

const dict = getDictionary('fr');

type PropsType = {
  reviews: ProductMultiVariants['reviews'];
  className?: string;
};

const Reviews: React.FC<PropsType> = ({ reviews, className }) => {
  const averageRating = calculateAverageRatings(
    reviews.map(({ rating }) => rating),
  );
  return (
    <div className={`flex w-full flex-col ${className}`}>
      <div className="flex items-center gap-3 bg-slate-100 py-3 px-4">
        <p className="text-2xl font-semibold">
          {averageRating.toLocaleString('fr-FR')}/5
        </p>
        <div className="flex flex-col gap-1">
          <ReviewStars
            rating={averageRating}
            className="gap-1"
          />
          <div className="text-sm">
            {dict.components.productCard.reviews.reviewCount({
              reviewCount: reviews.length,
            })}
          </div>
        </div>
      </div>
      <div className="max-h-80 overflow-auto">
        {reviews.map((review) => {
          const reviewAuthorName = review.authorNickname ?? review.author.name;
          return (
            <div
              key={review.id}
              className="flex flex-col border-b border-slate-200 p-4"
            >
              <div className="flex items-center gap-2">
                <ReviewStars
                  rating={review.rating}
                  className="gap-1"
                />
              </div>
              <div className="mt-2 text-sm text-slate-500">
                {review.content}
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs">
                <Avatar
                  name={reviewAuthorName}
                  profilePictureUrl={review.author.profilePictureUrl}
                  className="w-8"
                />
                <div className="flex flex-col">
                  <p>{reviewAuthorName}</p>
                  <p className="text-slate-500">
                    {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Reviews;
