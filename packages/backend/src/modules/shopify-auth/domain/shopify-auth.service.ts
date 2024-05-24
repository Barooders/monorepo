/* eslint-disable import/no-restricted-paths */
import { Injectable } from '@nestjs/common';
import {
  CookieNotFound,
  InvalidOAuthError,
  InvalidSession,
} from '@shopify/shopify-api';
import type { Request, Response } from 'express';

import { routesV1 } from '@config/routes.config';
import { PostgreSQLSessionStorage } from '@libs/infrastructure/shopify/session-storage/postgresql-session-storage/postgresql-session-storage.lib';
import { ShopifyApiBySession } from '@libs/infrastructure/shopify/shopify-api/shopify-api-by-session.lib';

@Injectable()
export class ShopifyAuthService {
  constructor(
    private shopifyApiBySession: ShopifyApiBySession,
    private sessionStorage: PostgreSQLSessionStorage,
  ) {}

  private async redirectToAuth(req: Request, res: Response): Promise<void> {
    const shop = req?.query?.shop ?? '';

    res.redirect(`/${routesV1.version}${routesV1.shopify.auth}?shop=${shop}`);
  }

  private async handleCallbackError(
    req: Request,
    res: Response,
    error: Error,
  ): Promise<void> {
    switch (true) {
      case error instanceof InvalidOAuthError:
      case error instanceof InvalidSession:
        res.status(400);
        res.send(error.message);
        break;
      case error instanceof CookieNotFound:
        await this.redirectToAuth(req, res);
        break;
      default:
        res.status(500);
        res.send(error.message);
        break;
    }
  }

  async handleAuthentication(req: Request, res: Response, authInputDto: any) {
    const { shop } = authInputDto;

    const shopify = this.shopifyApiBySession.getInstance();
    const sanitizedShop = shopify.utils.sanitizeShop(shop, true);

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!sanitizedShop) {
      throw new Error('Invalid shop');
    }

    // https://github.com/Shopify/shopify-api-js/blob/main/docs/reference/auth/begin.md
    await shopify.auth.begin({
      /**
       * ! Required
       * A Shopify domain name in the form {exampleshop}.myshopify.com.
       */
      shop: sanitizedShop,

      /**
       * ! Required
       * The path to the callback endpoint, with a leading /. This URL must
       * be allowed in the Partners dashboard, or using the CLI to run your app.
       */
      callbackPath: `/${routesV1.version}${routesV1.shopify.authCallback}`,

      /**
       * ! Required
       * true if the session is online and false otherwise
       * Learn more about [OAuth access modes](https://shopify.dev/apps/auth/oauth/access-modes).
       */
      isOnline: false,

      /**
       * ! Required
       * The HTTP Request object used by your runtime.
       */
      rawRequest: req,

      /**
       * ! Required for Node.js
       * The HTTP Response object used by your runtime. Required for Node.js.
       */
      rawResponse: res,
    });
  }

  async handleAuthenticationCallback(
    req: Request,
    res: Response,
    authCallbackInputDto: any,
  ) {
    try {
      const { shop } = authCallbackInputDto;

      const shopify = this.shopifyApiBySession.getInstance();

      // https://github.com/Shopify/shopify-api-js/blob/main/doc^s/reference/auth/callback.md
      const callback = await shopify.auth.callback({
        /**
         * ! Required
         * The HTTP Request object used by your runtime.
         */
        rawRequest: req,

        /**
         * ! Required for Node.js
         * The HTTP Response object used by your runtime.
         */
        rawResponse: res,
      });

      await this.sessionStorage.storeSession(callback.session);

      // Will redirect to the app installation details page since the app
      // has no backoffice UI at the moment.
      const redirectUrl = `https://${shop}/admin/settings/apps/app_installations/app/barooders-backend`;

      return res.redirect(redirectUrl);
    } catch (err) {
      await this.handleCallbackError(req, res, err as Error);
    }
  }
}
