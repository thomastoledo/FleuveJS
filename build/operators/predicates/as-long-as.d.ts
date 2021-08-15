import { OperatorFunction } from "../../models/operator";
export declare const asLongAs: <T = any>(f: OperatorFunction<T, boolean>) => OperatorFunction<T, Promise<T>>;
