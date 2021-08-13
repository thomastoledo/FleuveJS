export declare class Subscription {
    private _unsubscribeCallback;
    constructor(_unsubscribeCallback: UnsubscribeCallback);
    unsubscribe(): void;
}
interface UnsubscribeCallback {
    (): void;
}
export declare class Subscriber<T = any> {
    private _onNext;
    private _onError?;
    private _onComplete?;
    static isInstanceOfSubscriber(obj: any): obj is Subscriber;
    static of<T>(onNext: OnNext<T>, onError?: OnError, onComplete?: OnComplete<T>): Subscriber<T>;
    private constructor();
    onNext(t: T): void;
    onError(err: Error): void | undefined;
    onComplete(value: T | Error | undefined): void | undefined;
}
export interface OnNext<T> {
    (t: T): void;
}
export interface OnError {
    (err: Error): void;
}
export interface OnComplete<T> {
    (result: T | Error | undefined): void;
}
export {};
