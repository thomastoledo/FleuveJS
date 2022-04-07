import { OperationResult, OperationResultFlag, } from "../../models/operator";
export var take = function (n) {
    var cpt = 0;
    return function (source) {
        cpt++;
        if (cpt > n) {
            return new OperationResult(source, OperationResultFlag.MustStop);
        }
        return new OperationResult(source);
    };
};
