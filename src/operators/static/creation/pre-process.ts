import { OperationResult, OperatorFunction } from "../../../models/operator";
import { MutableObservable } from "../../../observable/mutable-observable";

export function preProcess<T = never>(...operations: OperatorFunction<any, OperationResult<T>>[]): MutableObservable<T> {
    const obs$ = new MutableObservable<T>();
    (obs$ as any)._preProcessOperations.push(...operations);
    return obs$;
}