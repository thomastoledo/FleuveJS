import { OperationResult, OperationResultFlag, } from "../../models/operator";
export var filter = function (f) {
    return function (source) {
        return new OperationResult(source, !f(source) ? OperationResultFlag.FilterNotMatched : undefined);
    };
};
