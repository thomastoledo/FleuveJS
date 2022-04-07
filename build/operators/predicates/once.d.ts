import { OperationResult, OperatorFunction } from "../../models/operator";
export declare const once: <T = any>(f?: OperatorFunction<T, boolean> | undefined) => OperatorFunction<T, OperationResult<T>>;
