import { Observable } from "../../observable/observable";
import {
  OperatorFunction,
  OperationResult,
  OperationResultFlag,
} from "../../models/operator";
import { of } from "../static/creation/of";
import { filter } from "./filter";

export const ifElse = function <T = any, U = any>(
  predicate: OperatorFunction<T, boolean>,
  ifs: OperatorFunction<T, OperationResult<U>>[],
  elses?: OperatorFunction<T, OperationResult<U>>[]
): OperatorFunction<T, OperationResult<Observable<U>>> {
  return (source: T) => {
    const operationResult = filter(predicate)(source);
    return new OperationResult(
      !operationResult.isFilterNotMatched()
        ? of(source).pipe(...ifs)
        : of(source).pipe(...(elses ?? [])),
      OperationResultFlag.UnwrapSwitch
    );
  };
};
