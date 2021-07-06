import { Subscriber, Listener, EventSubscription } from "./models/event";
import { OperatorFunction } from "./models/operator";
export declare class Fleuve<T = never> {
    private _innerValue?;
    private readonly _subscribers;
    private _preProcessOperations;
    private _isStarted;
    private _isComplete;
    private _forks$;
    constructor(_innerValue?: T | undefined);
    addEventListener(selector: string, eventType: string, listener: Listener<T>, options?: AddEventListenerOptions): EventSubscription;
    dam(): void;
    fork(...operators: OperatorFunction<T>[]): Fleuve<T>;
    next(...events: T[]): this;
    pile(...operations: OperatorFunction<T>[]): this;
    pipe<U = any>(...operations: OperatorFunction<T>[]): Fleuve<U>;
    subscribe(subscriber: Subscriber<T>): void;
    private _filterNonFunctions;
    private _isFunction;
    private _callSubscribers;
    private _computeValue;
    private _createEventListenerFromListener;
    private _complete;
}
