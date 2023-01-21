import { OperationResult, OperatorFunction } from "../models/operator";
import { OnNext, Subscriber, Subscription } from "../models/subscription";
import { ObservableFork, Types } from '../models/types';
export declare class Observable<T = never> implements Types.Observable<T> {
    protected _innerSequence: OperationResult<T>[];
    protected _subscribers: Subscriber<T>[];
    protected _isComplete: boolean;
    protected _error: Error;
    protected _forks: ObservableFork<any>[];
    protected get innerSequence(): OperationResult<T>[];
    protected set innerSequence(sequence: OperationResult<T>[]);
    constructor(...initialSequence: T[]);
    pipe<U = any>(...operations: OperatorFunction<T, OperationResult<U>>[]): Observable<U>;
    subscribe(subscriber: OnNext<T> | Subscriber<T>): Subscription;
    protected executeSubscriber(_subscriber: Subscriber<T>, sequence: OperationResult<T>[]): void;
    private _computeValue;
    protected _executeOperations<T, U = any>(value: T, operators: OperatorFunction<T, OperationResult<U>>[]): OperationResult<U>;
}
