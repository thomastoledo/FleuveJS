import { OnNext, OperationResult, OperatorFunction, Subscriber, Subscription } from "../../../models";
import { Observable } from "../../../observable/observable";
export interface ProxyObservableFunction<T = never> {
    (...args: any): any;
    asObservable: () => ProxyObservable<T>;
    subscribe: (subscriber?: OnNext<T> | Subscriber<T> | undefined) => Subscription;
    pipe: <U>(...operations: OperatorFunction<T, OperationResult<U>>[]) => Observable<U>;
}
declare class ProxyObservable<T = never> extends Observable<T> implements Observable<T> {
    private proxy;
    private constructor();
    static create<T>(f: (...args: any) => T): ProxyObservableFunction<T>;
}
export declare const fromFunction: <T = any>(f: (...args: any) => T) => ProxyObservableFunction<T>;
export {};
