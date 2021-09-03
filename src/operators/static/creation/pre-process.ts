import { Observable } from "../../../observable/observable";
import { OperationResult, OperatorFunction } from "../../../models/operator";

export function preProcess<T = never>(...operations: OperatorFunction<any, OperationResult<T>>[]): Observable<T> {
    const obs$ = new Observable<T>();
    (obs$ as any)._preProcessOperations.push(...operations);
    return obs$;
}