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
): OperatorFunction<T, OperationResult<U | T>> {
  return (source: T) => {
    const operationResult = filter(predicate)(source);
    const operators = !operationResult.isFilterNotMatched() ? ifs : (elses ?? []);
    
    const start = operators.shift();
    if (start) {
      return operators.reduce((acc, curr) => curr(acc.value as any), start(source));
    }
    return operationResult;
  };
};
