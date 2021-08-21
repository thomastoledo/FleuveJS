import { isFunction } from "../helpers/function.helper";
export class Subscription {
    constructor(private _unsubscribeCallback: UnsubscribeCallback) {}
    
    unsubscribe(): void {
        this._unsubscribeCallback();
    }
}

interface UnsubscribeCallback {
    (): void
}

export interface Subscriber<T = any> {
  next: OnNext<T>, error?: OnError, complete?: OnComplete<T>
}

export function isInstanceOfSubscriber(obj: any): obj is Subscriber {
  return isFunction(obj.next) && (obj.error === undefined || isFunction(obj.error)) && (obj.complete == undefined || isFunction(obj.complete));
}

export function subscriberOf<T>(next: OnNext<T>, error?: OnError, complete?: OnComplete<T>): Subscriber<T> {
  if (!isInstanceOfSubscriber({next, error, complete})) {
    throw new Error(`Please provide functions for onNext, onError and onComplete`);
  }
  return {next, error, complete};
}

  
  export interface OnNext<T> {
    (t: T): void;
  }
  
  export interface OnError {
    (err: Error): void
  }
  
  export interface OnComplete<T> {
    (result: T | Error | undefined): void
  };
  