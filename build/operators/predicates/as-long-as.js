import { OperationResult, OperationResultFlag, } from "../../models/operator";
import { filter } from "./filter";
export var asLongAs = function (f) {
    var stopped = false;
    return function (source) {
        return new OperationResult(source, (stopped = stopped || filter(f)(source).isFilterNotMatched())
            ? OperationResultFlag.MustStop
            : undefined);
    };
};
