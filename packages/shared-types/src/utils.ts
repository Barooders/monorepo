/* eslint-disable no-restricted-imports */
import { merge as lodashMerge } from 'lodash';

export const merge = <TObject, TSource>(
  object: TObject,
  source: TSource,
): TObject & TSource => {
  return lodashMerge({}, object, source);
};
