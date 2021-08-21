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

export class Fleuve<T = never> {
  private _subscribers: Subscriber<T>[] = [];

  private _preProcessOperations: OperatorFunction<T, any>[] = [];
  private _forkPipeline: OperatorFunction<T, any>[] = [];

  private _isStarted: boolean = false;
  private _isComplete: boolean = false;

  private _forks$: Fleuve<T>[] = [];

  private _error: Error | null = null;

  private _isFinite!: boolean;

  constructor(private _innerValue?: T) {
    this._isStarted = arguments.length > 0;
  }

  addEventListener(
    selector: string,
    eventType: string,
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

  close(): void {
    this._complete();
    this.closeForks();
    this._nextComplete();
  }

  closeForks(): void {
    this._forks$.forEach((fork$) => {
      fork$.closeForks();
      fork$._complete();
      fork$._nextComplete();
    });
  }

  compile(...operations: OperatorFunction<T, OperationResult<any>>[]): this {
    if (this._isFinite || this._isComplete || !!this._error) {
      return this;
    }

    try {
      const operationResult = this._executeOperations(
        this._innerValue as T,
        operations
      );

      if (operationResult.isMustStop()) {
        this._complete();
        this._nextComplete();
        return this;
      }

      if (operationResult.isFilterNotMatched()) {
        return this;
      }

      this.next(operationResult.value);
    } catch (err) {
      this._error = err;
      this._nextError();
      this.close();
    }

    return this;
  }

  fork(...operators: OperatorFunction<T, OperationResult<any>>[]): Fleuve<T> {
    const fork$: Fleuve<T> = new Fleuve();
    fork$._forkPipeline = operators;

    this.subscribe(
      (value: T) => {
        if (!!fork$._error) {
          return;
        }

        try {
          const operationResult = fork$._executeOperations(
            value,
            fork$._forkPipeline
          );

          if (operationResult.isMustStop()) {
            fork$._complete();
            fork$._nextComplete();
            return;
          }

          if (operationResult.isFilterNotMatched()) {
            return;
          }

          fork$.next(operationResult.value);
        } catch (err) {
          fork$._error = err;
          fork$._nextError();
        }
      },
      (err) => {
        fork$._error = err;
        fork$._nextError();
        fork$.close();
      },
      () => fork$._complete()
    );

    this._forks$.push(fork$);
    return fork$;
  }

  next(...events: T[]): this {
    if (this._isFinite || this._isComplete || !!this._error || !(this._isStarted = this._isStarted || arguments.length > 0)) {
      return this;
    }

    for (let i = 0; i < events.length; i++) {
      const operationResult = this._executeOperations(
        events[i],
        this._preProcessOperations
      );
      
      if (operationResult.isMustStop()) {
        this._complete();
        this._nextComplete();
        break;
      }

      if (operationResult.isFilterNotMatched()) {
        break;
      }

      this._innerValue = operationResult.value;
      this._callSubscribers(operationResult.value, ...this._subscribers);
    }
    return this;
  }

  pipe<U = any>(
    ...operations: OperatorFunction<T, OperationResult<U>>[]
  ): Fleuve<U> {
    const fleuve$ = new Fleuve<U>();
    if (!!this._error) {
      fleuve$._error = this._error;
      fleuve$.close();
      return fleuve$;
    }

    if (!this._isStarted) {
      return fleuve$;
    }

    try {
      const operationResult = this._executeOperations(
        this._innerValue as T,
        operations
      );

      if (
        operationResult.isMustStop() ||
        operationResult.isFilterNotMatched()
      ) {
        fleuve$._complete();
        fleuve$._nextComplete();
        return fleuve$;
      }
      fleuve$.next(operationResult.value);
    } catch (err) {
      fleuve$._error = err;
    }

    return fleuve$;
  }

  subscribe(
    onNext: OnNext<T>,
    onError?: OnError,
    onComplete?: OnComplete<T>
  ): Subscription;
  subscribe(subscriber: Subscriber<T>): Subscription;
  subscribe(
    onNext: OnNext<T> | Subscriber<T>,
    onError?: OnError,
    onComplete?: OnComplete<T>
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

  private _nextError() {
    this._subscribers.forEach((s) => this._doError(s));
  }

  private _nextComplete() {
    this._subscribers.forEach((s) => this._doComplete(s));
  }

  private _createSubscriber(
    onNext: OnNext<T> | Subscriber<T>,
    onError?: OnError,
    onComplete?: OnComplete<T>
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
      subscriber.complete(this._error ?? this._innerValue);
    }
  }

  private _doError(subscriber: Subscriber<T>) {
    if (!!this._error && subscriber.error) {
      subscriber.error(this._error);
    }
  }

  private _doNext(subscriber: Subscriber<T>) {
    if (this._isStarted && !this._error) {
      subscriber.next(this._innerValue as T);
    }
  }

  private _callSubscribers(event: T, ...subscribers: Subscriber<T>[]): void {
    subscribers.forEach((s) => s.next(event));
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
          res = new OperationResult(res.value._innerValue);
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
      if (!this._error && !this._isComplete) {
        listener(this._innerValue as T, event);
      }
    };
  }

  private _complete() {
    this._isComplete = true;
  }

  private _executeOperations(
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
