import { OperationResult, OperatorFunction } from "../../models/operator";

export const map = function<T = any, U = T>(
  f: OperatorFunction<T, U>
): OperatorFunction<T, OperationResult<U>> {
  return (source) => new OperationResult(f(source));
};
