import { OperationResult, OperationResultFlag, OperatorFunction } from "../../models/operator";

export const nth = function<T = any>(n: number): OperatorFunction<T, OperationResult<T>> {
    let cpt = 0;
  return (source) => {
      cpt++;
      if (cpt === n) {
          return new OperationResult(source)
      }

      if (cpt < n) {
          return new OperationResult(source, OperationResultFlag.FilterNotMatched);
      }

      return new OperationResult(source, OperationResultFlag.MustStop);
  }
};
