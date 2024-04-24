'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.SearchPreset = exports.BundleType = exports.DiscountRange = void 0;
var DiscountRange;
(function (DiscountRange) {
  DiscountRange['FROM_0_TO_20'] = '0-20%';
  DiscountRange['FROM_20_TO_40'] = '20-40%';
  DiscountRange['FROM_40_TO_60'] = '40-60%';
  DiscountRange['FROM_60_TO_80'] = '60-80%';
  DiscountRange['FROM_80_TO_100'] = '80-100%';
})(DiscountRange || (exports.DiscountRange = DiscountRange = {}));
var BundleType;
(function (BundleType) {
  BundleType['NO_PRODUCT'] = 'no_product';
  BundleType['SINGLE_PRODUCT'] = 'single_product';
  BundleType['TWO_TO_NINE'] = 'two_to_nine';
  BundleType['TEN_PLUS'] = 'ten_plus';
})(BundleType || (exports.BundleType = BundleType = {}));
var SearchPreset;
(function (SearchPreset) {
  SearchPreset['PUBLIC'] = 'searchable_product_attributes';
  SearchPreset['B2B'] = 'searchable_b2b_product_attributes';
})(SearchPreset || (exports.SearchPreset = SearchPreset = {}));
//# sourceMappingURL=search.js.map
