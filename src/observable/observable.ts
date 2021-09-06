import { filterNonFunctions, isFunction } from "../helpers/function.helper";
import { Listener, EventSubscription } from "../models/event";
import {
  OperationResult,
  OperationResultFlag,
  OperatorFunction,
} from "../models/operator";
import {
  isInstanceOfSubscriber,
  subscriberOf,
  OnComplete,
  OnError,
  OnNext,
  Subscriber,
  Subscription,
} from "../models/subscription";

export class Observable<T = never> {
  protected _innerSequence: T[];
  protected _subscribers: Subscriber<T>[] = [];

  protected _isComplete: boolean = true;
  protected _error: Error | null = null;

  constructor(...initialSequence: T[]) {
    this._innerSequence = initialSequence;
  }

  /**
   * @param selector
   * @param eventType 
   * @param listener 
   * @param options 
   * @returns 
   */
  addEventListener(
    selector: string,
    eventType: keyof HTMLElementEventMap,
    listener: Listener<T>,
    options?: AddEventListenerOptions
  ): EventSubscription {
    const elem = document.querySelector(selector);

    if (!elem) {
      throw new Error(`Could not find any element with selector "${selector}"`);
    }

    const eventListener: EventListener =
      this._createEventListenerFromListener(listener);

    elem.addEventListener(eventType, eventListener, options);

    return new EventSubscription(elem, eventType, eventListener);
  }

  pipe<U = any>(
    ...operations: OperatorFunction<T, OperationResult<U>>[]
  ): Observable<U> {
    const obs$ = new Observable<U>();

    if (!!this._error) {
      obs$._error = this._error;
      obs$._complete();
      return obs$;
    }

    const newSequence = [];
    for (let i = 0; i < this._innerSequence.length; i++) {
      try {
        const operationResult = this._executeOperations(this._innerSequence[i], operations);
        if (operationResult.isMustStop() || operationResult.isFilterNotMatched()) {
          obs$._complete();
          return obs$;
        }

        newSequence.push(operationResult.value);
      } catch (error: any) {
        obs$._error = error;
        obs$._complete();
        return obs$;
      }

    }
    obs$._innerSequence = newSequence;
    return obs$;
  }

  subscribe(
    onNext: OnNext<T>,
    onError?: OnError,
    onComplete?: OnComplete
  ): Subscription;
  subscribe(subscriber: Subscriber<T>): Subscription;
  subscribe(
    onNext: OnNext<T> | Subscriber<T>,
    onError?: OnError,
    onComplete?: OnComplete
  ): Subscription {
    if (!isFunction(onNext) && !isInstanceOfSubscriber(onNext)) {
      throw new Error("Please provide either a function or a Subscriber");
    }

    let subscriber: Subscriber<T> = this._createSubscriber(
      onNext,
      onError,
      onComplete
    );

    this._doNext(subscriber);
    this._doError(subscriber);
    this._doComplete(subscriber);

    this._subscribers.push(subscriber);

    return new Subscription(
      () =>
        (this._subscribers = this._subscribers.filter((s) => s !== subscriber))
    );
  }

  protected _triggerOnError() {
    this._subscribers.forEach((s) => this._doError(s));
  }

  protected _triggerOnComplete() {
    this._subscribers.forEach((s) => this._doComplete(s));
  }

  private _createSubscriber(
    onNext: OnNext<T> | Subscriber<T>,
    onError?: OnError,
    onComplete?: OnComplete
  ): Subscriber<T> {
    if (isFunction(onNext)) {
      return subscriberOf(
        onNext,
        (isFunction(onError) && onError) || undefined,
        (isFunction(onComplete) && onComplete) || undefined
      );
    }
    return onNext;
  }

  private _doComplete(subscriber: Subscriber<T>) {
    if (this._isComplete && subscriber.complete) {
      subscriber.complete();
    }
  }

  private _doError(subscriber: Subscriber<T>) {
    if (!!this._error && subscriber.error) {
      subscriber.error(this._error);
    }
  }

  private _doNext(subscriber: Subscriber<T>) {
    this._innerSequence.forEach(value => subscriber.next(value));
  }

  private _computeValue(
    initValue: T,
    ...operations: OperatorFunction<T, OperationResult<any>>[]
  ): OperationResult<any> {
    let res: OperationResult<any> = new OperationResult(initValue);
    for (let i = 0; i < operations.length; i++) {
      res = operations[i](res.value);
      switch (res.flag) {
        case OperationResultFlag.FilterNotMatched:
        case OperationResultFlag.MustStop:
          i = operations.length;
          break;
        case OperationResultFlag.UnwrapSwitch:
          res = new OperationResult(res.value._innerSequence.pop());
          break;
        default:
          break;
      }
    }
    return res;
  }

  private _createEventListenerFromListener(
    listener: Listener<T>
  ): EventListener {
    return (event: Event) => {
      if (!this._error) {
        this._innerSequence.forEach(value => listener(value, event));
      }
    };
  }

  protected _complete() {
    this._isComplete = true;
  }

  protected _executeOperations(
    value: T,
    operators: OperatorFunction<T, OperationResult<any>>[]
  ): OperationResult<any> {
    const computedValue = this._computeValue(
      value as T,
      ...(filterNonFunctions(...operators) as OperatorFunction<
        T,
        OperationResult<any>
      >[])
    );

    return computedValue;
  }
}
