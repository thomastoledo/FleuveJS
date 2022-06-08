export declare class Subscription {
    private _unsubscribeCallback?;
    constructor(_unsubscribeCallback?: UnsubscribeCallback | undefined);
    unsubscribe(): void;
}
export declare const EMPTY_SUBSCRIPTION: Subscription;
interface UnsubscribeCallback {
    (): void;
}
export interface Subscriber<T = any> {
    name?: string;
    next?: OnNext<T>;
    error?: OnError;
    complete?: OnComplete;
}
export declare function isInstanceOfSubscriber(obj: any): obj is Subscriber;
export declare function subscriberOf<T>(next?: OnNext<T>, error?: OnError, complete?: OnComplete): Subscriber<T>;
export interface OnNext<T> {
    (t: T): void;
}
export interface OnError {
    (err: Error): void;
}
export interface OnComplete {
    (): void;
}
export {};
