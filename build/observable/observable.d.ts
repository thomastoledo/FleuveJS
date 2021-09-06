import { Listener, EventSubscription } from "../models/event";
import { OperationResult, OperatorFunction } from "../models/operator";
import { OnComplete, OnError, OnNext, Subscriber, Subscription } from "../models/subscription";
export declare class Observable<T = never> {
    protected _innerSequence: T[];
    protected _subscribers: Subscriber<T>[];
    protected _isComplete: boolean;
    protected _error: Error | null;
    constructor(...initialSequence: T[]);
    /**
     * @param selector
     * @param eventType
     * @param listener
     * @param options
     * @returns
     */
    addEventListener(selector: string, eventType: keyof HTMLElementEventMap, listener: Listener<T>, options?: AddEventListenerOptions): EventSubscription;
    pipe<U = any>(...operations: OperatorFunction<T, OperationResult<U>>[]): Observable<U>;
    subscribe(onNext: OnNext<T>, onError?: OnError, onComplete?: OnComplete): Subscription;
    subscribe(subscriber: Subscriber<T>): Subscription;
    protected _triggerOnError(): void;
    protected _triggerOnComplete(): void;
    private _createSubscriber;
    private _doComplete;
    private _doError;
    private _doNext;
    private _computeValue;
    private _createEventListenerFromListener;
    protected _complete(): void;
    protected _executeOperations(value: T, operators: OperatorFunction<T, OperationResult<any>>[]): OperationResult<any>;
}
