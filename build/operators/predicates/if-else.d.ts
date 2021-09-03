import { Fleuve } from "../../fleuve/fleuve";
import { OperatorFunction, OperationResult } from "../../models/operator";
export declare const ifElse: <T = any, U = any>(predicate: OperatorFunction<T, boolean>, ifs: OperatorFunction<T, OperationResult<U>>[], elses?: OperatorFunction<T, OperationResult<U>>[] | undefined) => OperatorFunction<T, OperationResult<Fleuve<U>>>;
