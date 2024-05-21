"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.merge = void 0;
/* eslint-disable no-restricted-imports */
const lodash_1 = require("lodash");
const merge = (object, source1, source2, source3, source4) => {
    return (0, lodash_1.merge)({}, object, source1, source2, source3, source4);
};
exports.merge = merge;
//# sourceMappingURL=utils.js.map