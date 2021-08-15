"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asLongAs = void 0;
var operator_1 = require("../../models/operator");
var filter_1 = require("./filter");
var asLongAs = function (f) {
    var stopped = false;
    return function (source) {
        return new operator_1.OperationResult(source, (stopped = stopped || filter_1.filter(f)(source).isFilterNotMatched())
            ? operator_1.OperationResultFlag.MustStop
            : undefined);
    };
};
exports.asLongAs = asLongAs;
