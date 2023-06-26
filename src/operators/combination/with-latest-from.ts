import { isNotNullOrUndefined } from "../../helpers/function.helper";
import {
    OperationResult,
    OperationResultFlag,
    OperatorFunction,
  } from "../../models/operator";
  import { Observable } from "../../observable/observable";
  
  export function withLatestFrom<T, R extends unknown>(
    ...observables: Observable<R | any>[]
  ): OperatorFunction<T, OperationResult<[Observable<T>, ...Observable<(R |any)>[]]>> {
    observables.forEach((o) => {

    })
    // const lastValues = observables
    // .map((obs) => (obs as any)._innerSequence[(obs as any)._innerSequence.length - 1])
    // .filter(isNotNullOrUndefined)
    // .filter((operationResult: OperationResult<any>) => !operationResult.isOperationError())
    // .map((operationResult) => operationResult.value);

    // return (source: T) => new OperationResult([source, ...lastValues], lastValues.length < observables.length ? OperationResultFlag.FilterNotMatched : undefined)
    return (source: T) => new Observable()
  }
  