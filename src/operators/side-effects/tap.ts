import {
    OperationResult,
    OperatorFunction,
  } from "../../models/operator";
  
  export const tap = function <T = any>(
    f: OperatorFunction<T, boolean>
  ): OperatorFunction<T, OperationResult<T>> {
    return (source: T) => {
        f(source);
      return new OperationResult(source);
    };
  };