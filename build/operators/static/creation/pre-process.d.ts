import { OperationResult, OperatorFunction } from "../../../models/operator";
import { MutableObservable } from "../../../observable";
export declare function preProcess<T = never>(...operations: OperatorFunction<any, OperationResult<T>>[]): MutableObservable<T>;
