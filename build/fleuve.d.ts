import { IFleuve } from "./models";
import { NextCallback, Subscriber, Listener, EventSubscription } from "./models/event";
import { OperatorFunction } from "./models/operator";
export declare class Fleuve<T = any> implements IFleuve {
    private _innerSource?;
    private readonly subscribers;
    private _parent$?;
    private _preProcessOperations;
    private _isError;
    constructor(_innerSource?: T | undefined);
    next(...events: T[] | NextCallback<T>[]): void;
    subscribe(subscriber: Subscriber<T | undefined>): void;
    pipe(...operations: OperatorFunction<T>[]): Fleuve<any>;
    fork(...operators: OperatorFunction<T>[]): IFleuve;
    addEventListener(selector: string, eventType: string, listener: Listener<T | undefined>, options: AddEventListenerOptions): EventSubscription;
    private _filterNonFunctions;
    private _isFunction;
    private _isOnlyFunctionsOrOnlyScalars;
    private _nextEvent;
    private _computeValue;
}
