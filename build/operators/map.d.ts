import { OperatorCallback, OperatorFunction } from "../models/operator";
export declare const map: <T = any, U = T>(f: OperatorCallback<T, U>) => OperatorFunction<T, U>;
