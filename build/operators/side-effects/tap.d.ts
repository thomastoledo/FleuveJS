import { OperationResult, OperatorFunction } from "../../models/operator";
export declare const tap: <T = any>(f: OperatorFunction<T, boolean>) => OperatorFunction<T, OperationResult<T>>;
