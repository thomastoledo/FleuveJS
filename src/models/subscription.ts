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

export class Subscriber<T = any> {
  
    static isInstanceOfSubscriber(obj: any): obj is Subscriber {
      return obj instanceof Subscriber;
    }
  
    static of<T>(onNext: OnNext<T>, onError?: OnError, onComplete?: OnComplete<T>): Subscriber<T> {
      return new Subscriber<T>(onNext, onError, onComplete);
    }
  
    private constructor(
      private _onNext: OnNext<T>, private _onError?: OnError, private _onComplete?: OnComplete<T>) {
        if (!isFunction(this.onNext) || !isFunction(this.onError) || !isFunction(this.onComplete)) {
          throw new Error(`Please provide functions for onNext, onError and onComplete`);
        }
    }
  
    public onNext(t: T) {
      return this._onNext(t);
    }
  
    public onError(err: Error) {
      return this._onError && this._onError(err);
    }
  
    public onComplete(value: T | Error | undefined) {
      return this._onComplete && this._onComplete(value);
    }
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
  