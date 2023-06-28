import { OperationResult, OperatorFunction } from "../models/operator";
import { OnNext, Subscriber, Subscription } from "../models/subscription";
import { ObservableFork } from "./observable-fork";
export declare class Observable<T = never> {
    protected _innerSequence: OperationResult<T>[];
    protected _subscribers: Subscriber<T>[];
    protected _isComplete: boolean;
    protected _error: Error;
    protected _forks: ObservableFork<any>[];
    protected get innerSequence(): OperationResult<T>[];
    protected set innerSequence(sequence: OperationResult<T>[]);
    constructor(...initialSequence: T[]);
    pipe<U = any>(...operations: OperatorFunction<T, OperationResult<U>>[]): Observable<U>;
    subscribe(subscriber?: OnNext<T> | Subscriber<T> | undefined): Subscription;
    protected executeSubscriber(sequence: OperationResult<T>[], _subscriber?: Subscriber<T> | undefined): void;
    private _computeValue;
    protected _executeOperations<T, U = any>(value: T, operators: OperatorFunction<T, OperationResult<U>>[]): OperationResult<U>;
}
