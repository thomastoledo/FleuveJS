import { Fleuve } from "../../fleuve/fleuve";
import {
  OperationResult,
  OperationResultFlag,
  OperatorFunction,
} from "../../models/operator";

export function switchMap<T = any, U = T>(
  f: OperatorFunction<T, Fleuve<U>>
): OperatorFunction<T, OperationResult<Fleuve<U>>> {
  return (source: T) => new OperationResult(f(source), OperationResultFlag.UnwrapSwitch);
}
