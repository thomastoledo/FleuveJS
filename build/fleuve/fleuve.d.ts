import { Listener, EventSubscription } from "../models/event";
import { OperatorFunction } from "../models/operator";
import { OnComplete, OnError, OnNext, Subscriber, Subscription } from "../models/subscription";
export declare class Fleuve<T = never> {
    private _innerValue?;
    private _subscribers;
    private _preProcessOperations;
    private _isStarted;
    private _isComplete;
    private _isOperating;
    private _forks$;
    private _error;
    constructor(_innerValue?: T | undefined);
    addEventListener(selector: string, eventType: string, listener: Listener<T>, options?: AddEventListenerOptions): EventSubscription;
    /**
     * @deprecated use the close() method
     */
    dam(): void;
    close(): void;
    fork(...operators: OperatorFunction<T>[]): Fleuve<T>;
    next(...events: T[]): this;
    /**
     * @deprecated please use compile - won't work next version
     * @param operations
     * @returns
     */
    pile(...operations: OperatorFunction<T>[]): this;
    compile(...operations: OperatorFunction<T>[]): this;
    pipe<U = any>(...operations: OperatorFunction<T, Promise<U>>[]): Fleuve<U>;
    subscribe(subscriber: Subscriber<T>): Subscription;
    subscribe(onNext: OnNext<T>, onError?: OnError, onComplete?: OnComplete<T>): Subscription;
    private _nextError;
    private _nextComplete;
    private _createSubscriber;
    private _doComplete;
    private _doError;
    private _doNext;
    private _callSubscribers;
    private _computeValue;
    private _createEventListenerFromListener;
    private _complete;
    private _executeOperations;
}
