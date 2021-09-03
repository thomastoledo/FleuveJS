import { Observable } from "../../../observable/observable";
import { OperationResult, OperatorFunction } from "../../../models/operator";
export declare function preProcess<T = never>(...operations: OperatorFunction<any, OperationResult<T>>[]): Observable<T>;
