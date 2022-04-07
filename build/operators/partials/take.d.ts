import { OperationResult, OperatorFunction } from "../../models/operator";
export declare const take: <T = any>(n: number) => OperatorFunction<T, OperationResult<T>>;
