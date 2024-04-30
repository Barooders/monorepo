import { ReviewsFieldsFragment } from '@/__generated/gql/public/graphql';
import { Url } from '@/types';

export const REVIEW_BLOCK_ANCHOR = 'product-reviews';

type AuthorType = {
  name: string;
  createdAt: string;
  profilePictureUrl: Url | null;
};
export type ReviewType = {
  id: string;
  title: string;
  rating: number;
  content: string | null;
  author: AuthorType;
  createdAt: string;
  authorNickname: string | null;
};

export const REVIEWS_FRAGMENT = /* GraphQL */ /* gql_public */ `
  fragment ReviewsFields on VendorReview {
    Review {
      content
      createdAt
      id
      rating
      title
      authorNickname
      Customer {
        createdAt
        sellerName
        profilePictureShopifyCdnUrl
      }
    }
  }
`;

export const mapReviewsFromFragment = (reviews: ReviewsFieldsFragment[]) =>
  reviews.map(({ Review }) => ({
    author: {
      name: Review.Customer.sellerName ?? '',
      createdAt: Review.Customer.createdAt,
      profilePictureUrl: Review.Customer.profilePictureShopifyCdnUrl,
    },
    authorNickname: Review.authorNickname ?? null,
    content: Review.content,
    rating: Review.rating,
    createdAt: Review.createdAt,
    title: Review.title,
    id: Review.id,
  })) ?? [];
