import { OperationResult, OperationResultFlag, } from "../../models/operator";
export var once = function (f) {
    var done = false;
    return function (source) {
        if (done) {
            return new OperationResult(source, OperationResultFlag.MustStop);
        }
        if (!f || f(source)) {
            done = true;
            return new OperationResult(source);
        }
        return new OperationResult(source, OperationResultFlag.FilterNotMatched);
    };
};
