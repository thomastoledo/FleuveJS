import {
  OperationResult,
  OperationResultFlag,
  OperatorFunction,
} from "../../models/operator";
import { filter } from "./filter";

export const until = function <T = any>(
  f: OperatorFunction<T, boolean>
): OperatorFunction<T, OperationResult<T>> {
  let stopped = false;
  return (source: T) =>
    new OperationResult(
      source,
      (stopped = stopped || !filter(f)(source).isFilterNotMatched())
        ? OperationResultFlag.MustStop
        : undefined
    );
};