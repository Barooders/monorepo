import type {
  IRateLimiterOptions,
  IRateLimiterQueueOpts,
} from 'rate-limiter-flexible';
import { RateLimiterMemory, RateLimiterQueue } from 'rate-limiter-flexible';

export const MAX_ITEMS_IN_QUEUE = 100000;
export type RateLimiter<Result> = {
  run: (fn: () => Promise<Result>) => Promise<Result>;
};

export const createRateLimiter = (
  options: IRateLimiterOptions & IRateLimiterQueueOpts = {
    points: 1,
    maxQueueSize: MAX_ITEMS_IN_QUEUE,
  },
) => {
  const limiterFlexible = new RateLimiterMemory(options);

  const limiterQueue = new RateLimiterQueue(limiterFlexible, {
    maxQueueSize: options.maxQueueSize,
  });

  return {
    run: async (fn: () => any) => {
      await limiterQueue.removeTokens(1);
      return fn();
    },
  };
};
