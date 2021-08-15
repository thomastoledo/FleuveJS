import { OperationResult, OperationResultFlag, } from "../../models/operator";
export function switchMap(f) {
    return function (source) { return new OperationResult(f(source), OperationResultFlag.UnwrapSwitch); };
}
