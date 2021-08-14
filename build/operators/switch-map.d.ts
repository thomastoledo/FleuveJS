import { Fleuve } from "../fleuve/fleuve";
import { OperatorFunction } from "../models/operator";
export declare function switchMap<T = any, U = T>(f: OperatorFunction<T, Fleuve<U>>): OperatorFunction<T, Promise<U>>;