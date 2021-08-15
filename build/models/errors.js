"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StopFleuveSignal = exports.FilterError = void 0;
var FilterError = /** @class */ (function () {
    function FilterError(stack) {
        this.stack = stack;
        this.name = 'FilterError';
        this.message = 'Filter predicate was not matched';
    }
    return FilterError;
}());
exports.FilterError = FilterError;
var StopFleuveSignal = /** @class */ (function () {
    function StopFleuveSignal(stack) {
        this.stack = stack;
        this.name = 'StopFleuveSignal';
        this.message = 'Predicate was not matched anymore, Fleuve stopped';
    }
    return StopFleuveSignal;
}());
exports.StopFleuveSignal = StopFleuveSignal;
