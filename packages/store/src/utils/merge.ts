/* eslint-disable no-restricted-imports */
import { merge as lodashMerge } from 'lodash';

export const merge = <TObject, TSource1, TSource2, TSource3, TSource4>(
  object: TObject,
  source1: TSource1,
  source2?: TSource2,
  source3?: TSource3,
  source4?: TSource4,
): TObject & TSource1 & TSource2 & TSource3 & TSource4 => {
  return lodashMerge({}, object, source1, source2, source3, source4);
};
