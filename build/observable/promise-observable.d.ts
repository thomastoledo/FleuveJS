import { Types } from "../models";
import { Observable } from "./observable";
export declare class PromiseObservable<T> extends Observable<T> implements Types.PromiseObservable<T> {
    constructor(promise: Promise<T>);
}
