import {
    OperationResult,
    OperationResultFlag,
    OperatorFunction,
  } from "../../models/operator";
  
  export const once = function<T = any>(
    f?: OperatorFunction<T, boolean>,
  ): OperatorFunction<T, OperationResult<T>> {
    let done = false;
    return (source) => {
      console.log('DONE', done, 'SOURCE', source);
      if (done) {
        return new OperationResult(source, OperationResultFlag.MustStop);
      }

      if (!f || f(source)) {
        done = true;
        return new OperationResult(source);
      }
      
      return new OperationResult(source, OperationResultFlag.FilterNotMatched);
    }
  };