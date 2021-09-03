import { OperationResult, } from "../../models/operator";
export var tap = function (f) {
    return function (source) {
        f(source);
        return new OperationResult(source);
    };
};
