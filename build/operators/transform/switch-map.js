"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.switchMap = void 0;
var operator_1 = require("../../models/operator");
function switchMap(f) {
    return function (source) { return new operator_1.OperationResult(f(source), operator_1.OperationResultFlag.UnwrapSwitch); };
}
exports.switchMap = switchMap;
