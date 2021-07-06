import { OperatorCallback, OperatorFunction } from "../models/operator";
export declare const filter: <T = any>(f: OperatorCallback<T, boolean>) => OperatorFunction<T, any>;
