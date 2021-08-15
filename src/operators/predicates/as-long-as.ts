import {
  OperationResult,
  OperationResultFlag,
  OperatorFunction,
} from "../../models/operator";
import { filter } from "./filter";

export const asLongAs = function <T = any>(
  f: OperatorFunction<T, boolean>
): OperatorFunction<T, OperationResult<T>> {
  let stopped = false;
  return (source: T) => {
    return new OperationResult(
      source,
      (stopped = stopped || filter(f)(source).isFilterNotMatched())
        ? OperationResultFlag.MustStop
        : undefined
    );
  };
};
