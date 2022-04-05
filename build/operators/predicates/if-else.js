import { filter } from "./filter";
export var ifElse = function (predicate, ifs, elses) {
    return function (source) {
        var operationResult = filter(predicate)(source);
        var operators = !operationResult.isFilterNotMatched() ? ifs : (elses !== null && elses !== void 0 ? elses : []);
        var start = operators.shift();
        if (start) {
            return operators.reduce(function (acc, curr) { return curr(acc.value); }, start(source));
        }
        return operationResult;
    };
};
