import {
  OperationResult,
  OperationResultFlag,
  OperatorFunction,
} from "../../models/operator";

export const take = function <T = any>(
  n: number
): OperatorFunction<T, OperationResult<T>> {
  let cpt = 0;
  return (source) => {
    cpt++;
    if (cpt > n) {
      return new OperationResult(source, OperationResultFlag.MustStop);
    }
    return new OperationResult(source);
  };
};
