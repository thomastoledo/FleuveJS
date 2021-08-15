"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filter = void 0;
var operator_1 = require("../../models/operator");
var filter = function (f) {
    return function (source) {
        return new operator_1.OperationResult(source, !f(source) ? operator_1.OperationResultFlag.FilterNotMatched : undefined);
    };
};
exports.filter = filter;
