import { OnNext, Subscriber, Subscription } from "../models";
import { OperationResult, OperatorFunction } from "../models/operator";
import { Observable } from "./observable";
export declare class PromiseObservable<T> extends Observable<T> {
    private promise;
    constructor(promise: Promise<T>);
    pipe<U = any>(...operations: OperatorFunction<T, OperationResult<U>>[]): Observable<U>;
    subscribe(subscriber: Subscriber<T> | OnNext<T>): Subscription;
}
