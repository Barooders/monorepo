import { ShopifySession } from '@libs/domain/prisma.main.client';
import { Injectable } from '@nestjs/common';
import { OnlineAccessInfo, SessionParams } from '@shopify/shopify-api';
import { omitBy } from 'lodash';
import { jsonParse, jsonStringify } from '@libs/helpers/json';

@Injectable()
export class SessionMapper {
  toPersistence(entity: SessionParams): ShopifySession {
    const shopifySession: ShopifySession = {
      ...entity,
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      scope: entity.state || null,
      expires: entity.expires || null,
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      accessToken: entity.accessToken || null,
      onlineAccessInfo: jsonStringify(entity.onlineAccessInfo),
    };

    return shopifySession;
  }

  toDomain(record: ShopifySession): SessionParams {
    return {
      ...(omitBy(record, (value) => value === null) as ShopifySession),
      onlineAccessInfo: jsonParse(
        record.onlineAccessInfo ?? '{}',
      ) as OnlineAccessInfo,
    } as SessionParams;
  }
}
