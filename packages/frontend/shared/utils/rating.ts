import mean from 'lodash/mean';

export const calculateAverageRatings = (ratings: number[]): number =>
  Math.round(mean(ratings) * 10) / 10;
