import { ExceptionBase, NotFoundException } from '@libs/domain/exceptions';
import { jsonStringify } from '@libs/helpers/json';
import { MAX_BREADCRUMBS_LENGTH } from '@modules/product/constants';

export class UserNotAllowedException extends ExceptionBase {
  constructor(productId: string, userId: string, action: string) {
    super(
      `User (${userId}) can't ${action} product ${productId} because it is not the owner`,
    );
  }

  readonly code = 'PRODUCT.USER_NOT_ALLOWED';
}

export class TooLongBreadcrumbsException extends ExceptionBase {
  constructor(baseCollectionId: string) {
    super(
      `Collection ${baseCollectionId} has breadcrumbs over the limit of ${MAX_BREADCRUMBS_LENGTH} elements`,
    );
  }

  readonly code = 'COLLECTION.TOO_LONG_BREADCRUMBS';
}

export class ProductNotFound extends NotFoundException {
  constructor(productWhereClause: string) {
    super(
      `Could not find product in public.Product table with where clause: ${jsonStringify(
        productWhereClause,
      )}`,
    );
  }
}

export class VariantNotFound extends NotFoundException {
  constructor(productId: string, variantId: string) {
    super(
      `No variant price found for product ${productId} and variant ${variantId}`,
    );
  }
}
