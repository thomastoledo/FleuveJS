import { OperationResult, OperatorFunction } from "../../models/operator";
import { Observable } from "../../observable/observable";
export declare function switchMap<T = any, U = T>(f: OperatorFunction<T, Observable<U>>): OperatorFunction<T, OperationResult<Observable<U>>>;
