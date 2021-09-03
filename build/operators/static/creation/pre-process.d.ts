import { Fleuve } from "../../../fleuve/fleuve";
import { OperationResult, OperatorFunction } from "../../../models/operator";
export declare function preProcess<T = never>(...operations: OperatorFunction<any, OperationResult<T>>[]): Fleuve<T>;
