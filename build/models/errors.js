"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterError = void 0;
var FilterError = /** @class */ (function () {
    function FilterError(stack) {
        this.stack = stack;
        this.name = 'FilterError';
        this.message = 'Filter predicate was not matched';
    }
    return FilterError;
}());
exports.FilterError = FilterError;
