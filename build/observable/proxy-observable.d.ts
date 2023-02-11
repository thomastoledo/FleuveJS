import { Types } from "../models";
import { ProxyObservableFunction } from "../operators";
import { Observable } from "./observable";
export declare class ProxyObservable<T = never> extends Observable<T> implements Types.Observable<T> {
    private proxy;
    private constructor();
    static create<T>(f: (...args: any) => T): ProxyObservableFunction<T>;
}
