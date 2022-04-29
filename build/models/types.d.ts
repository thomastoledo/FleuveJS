import { OperationResult, OperatorFunction } from "./operator";
import { OnNext, Subscriber, Subscription } from "./subscription";
export declare namespace Types {
    interface Observable<T = never> {
        pipe<U = any>(...operations: OperatorFunction<T, OperationResult<U>>[]): Observable<U>;
        subscribe(subscriber: OnNext<T> | Subscriber<T>): Subscription;
    }
    interface MutableObservable<T = never> extends Observable<T> {
        next(...events: T[]): this;
        compile(...operations: OperatorFunction<T, OperationResult<any>>[]): this;
        close(): void;
    }
    interface ObservableFork<T = never> extends Observable<T> {
        close(): void;
    }
    interface PromiseObservable<T = never> extends Observable<T> {
    }
}
export declare type Observable<T> = Types.Observable<T>;
export declare type MutableObservable<T> = Types.MutableObservable<T>;
export declare type ObservableFork<T> = Types.ObservableFork<T>;
export declare type PromiseObservable<T> = Types.PromiseObservable<T>;
