import { ExceptionBase } from '@libs/domain/exceptions';
import { MAX_BREADCRUMBS_LENGTH } from '@modules/product/constants';

export class TooLongBreadcrumbsException extends ExceptionBase {
  constructor(baseCollectionId: string) {
    super(
      `Collection ${baseCollectionId} has breadcrumbs over the limit of ${MAX_BREADCRUMBS_LENGTH} elements`,
    );
  }

  readonly code = 'COLLECTION.TOO_LONG_BREADCRUMBS';
}
