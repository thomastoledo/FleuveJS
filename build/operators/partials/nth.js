import { OperationResult, OperationResultFlag } from "../../models/operator";
export var nth = function (n) {
    var cpt = 0;
    return function (source) {
        cpt++;
        if (cpt === n) {
            return new OperationResult(source);
        }
        if (cpt < n) {
            return new OperationResult(source, OperationResultFlag.FilterNotMatched);
        }
        return new OperationResult(source, OperationResultFlag.MustStop);
    };
};
