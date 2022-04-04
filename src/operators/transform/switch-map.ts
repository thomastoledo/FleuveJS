import {
  OperationResult,
  OperationResultFlag,
  OperatorFunction,
} from "../../models/operator";
import { Observable } from "../../observable/observable";

export function switchMap<T = any, U = T>(
  f: OperatorFunction<T, Observable<U>>
): OperatorFunction<T, OperationResult<Observable<U>>> {
  return (source: T) => new OperationResult(f(source), OperationResultFlag.UnwrapSwitch);
}
