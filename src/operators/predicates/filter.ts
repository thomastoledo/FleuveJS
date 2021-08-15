import {
  OperationResult,
  OperationResultFlag,
  OperatorFunction,
} from "../../models/operator";

export const filter = function <T = any>(
  f: OperatorFunction<T, boolean>
): OperatorFunction<T, OperationResult<T>> {
  return (source) =>
    new OperationResult(
      source,
      !f(source) ? OperationResultFlag.FilterNotMatched : undefined
    );
};
