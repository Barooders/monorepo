import { RateLimiter, createRateLimiter } from '@libs/application/rate-limiter';
import { DefaultPrestashopClient } from './default.client';

export class RateLimitedPrestashopClient extends DefaultPrestashopClient {
  private rateLimiter?: RateLimiter<Response>;

  public async fetchPrestashop(
    path: string,
    options: RequestInit,
  ): Promise<Response> {
    return this.getOrCreateRateLimiter().run(() =>
      super.fetchPrestashop(path, options),
    );
  }

  private getOrCreateRateLimiter() {
    if (!this.rateLimiter) {
      this.rateLimiter = createRateLimiter();
    }

    return this.rateLimiter;
  }
}
