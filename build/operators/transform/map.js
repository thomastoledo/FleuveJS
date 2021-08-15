"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.map = void 0;
var operator_1 = require("../../models/operator");
var map = function (f) {
    return function (source) { return new operator_1.OperationResult(f(source)); };
};
exports.map = map;
