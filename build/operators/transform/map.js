import { OperationResult } from "../../models/operator";
export var map = function (f) {
    return function (source) { return new OperationResult(f(source)); };
};
