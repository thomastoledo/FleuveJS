import { OperatorFunction } from "../../models/operator";
export declare const until: <T = any>(f: OperatorFunction<T, boolean>) => OperatorFunction<T, Promise<T>>;
