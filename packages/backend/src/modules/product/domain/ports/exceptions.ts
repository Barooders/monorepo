import { ExceptionBase } from '@libs/domain/exceptions';

export class UserNotAllowedException extends ExceptionBase {
  constructor(productId: string, userId: string, action: string) {
    super(
      `User (${userId}) can't ${action} product ${productId} because it is not the owner`,
    );
  }

  readonly code = 'PRODUCT.USER_NOT_ALLOWED';
}
