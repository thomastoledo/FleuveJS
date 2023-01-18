import { Types } from "../../../models";
import { Observable } from "../../../observable/observable";
export interface ProxyObservableFunction<T = never> extends Types.Observable<T> {
    (...args: any): any;
    asObservable: () => ProxyObservable<T>;
}
declare class ProxyObservable<T = never> extends Observable<T> implements Types.Observable<T> {
    private proxy;
    private constructor();
    static create<T>(f: (...args: any) => T): ProxyObservableFunction<T>;
}
export declare const fromFunction: <T = any>(f: (...args: any) => T) => ProxyObservableFunction<T>;
export {};
