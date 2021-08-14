import { filterNonFunctions, isFunction } from "../helpers/function.helper";
import { FilterError } from "../models/errors";
import { Listener, EventSubscription } from "../models/event";
import { OperatorFunction } from "../models/operator";
import {
  OnComplete,
  OnError,
  OnNext,
  Subscriber,
  Subscription,
} from "../models/subscription";

export class Fleuve<T = never> {
  private _subscribers: Subscriber<T>[] = [];

  private _preProcessOperations: OperatorFunction<T, any>[] = [];

  private _isStarted: boolean = false;
  private _isComplete: boolean = false;

  private _isOperating: boolean = false;

  private _forks$: Fleuve<T>[] = [];

  private _error: Error | null = null;

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
    this._forks$.forEach((fork$) => {
      fork$.close();
      fork$._complete();
      fork$._nextComplete();
    });
  }

  fork(...operators: OperatorFunction<T>[]): Fleuve<T> {
    const fork$: Fleuve<T> = new Fleuve();
    fork$._preProcessOperations = operators;

    this.subscribe(
      (value: T) => {
        fork$._executeOperations(value, fork$._preProcessOperations)
        .then((value: T) => fork$.next(value))
        .catch((err) => {
          fork$._error = !(err instanceof FilterError) && err;
          fork$._nextError();
        });
      },
      (err) => (fork$._error = err),
      () => fork$._complete()
    );

    this._forks$.push(fork$);
    return fork$;
  }

  next(...events: T[]): this {
    if (this._isComplete || !!this._error) {
      return this;
    }

    if ((this._isStarted = this._isStarted || arguments.length > 0)) {
      events.forEach((event: T) => {
        this._innerValue = event;
        this._callSubscribers(event, ...this._subscribers);
      });
    }
    return this;
  }

  compile(...operations: OperatorFunction<T>[]): this {
    if (this._isComplete || !!this._error) {
      return this;
    }

    this._executeOperations(this._innerValue as T, operations)
    .then((value: T) => this.next(value))
    .catch((err) => {
      this._error = !(err instanceof FilterError) && err;
      this._nextError();
    });
    return this;
  }

  pipe<U = any>(...operations: OperatorFunction<T, Promise<U>>[]): Fleuve<U> {
    const fleuve$ = new Fleuve<U>();
    if (!this._isStarted || !!this._error || this._isComplete) {
      fleuve$._complete();
      return fleuve$;
    }

    this._executeOperations(this._innerValue as T, operations)
    .then((value: U) => fleuve$.next(value))
    .catch((err) => {
      fleuve$._error = !(err instanceof FilterError) && err;
      fleuve$._nextError();
      fleuve$._isComplete = err instanceof FilterError;
      fleuve$._nextComplete();
    });
    return fleuve$;
  }

  subscribe(subscriber: Subscriber<T>): Subscription;
  subscribe(
    onNext: OnNext<T>,
    onError?: OnError,
    onComplete?: OnComplete<T>
  ): Subscription;
  subscribe(
    onNext: OnNext<T> | Subscriber<T>,
    onError?: OnError,
    onComplete?: OnComplete<T>
  ): Subscription {
    if (!isFunction(onNext) && !Subscriber.isInstanceOfSubscriber(onNext)) {
      throw new Error("Please provide either a function or a Subscriber");
    }

    let subscriber: Subscriber<T> =
      this._createSubscriber(onNext, onError, onComplete);

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
    onNext: OnNext<T> | Subscriber<any>,
    onError?: OnError,
    onComplete?: OnComplete<T>
  ): Subscriber<T> {
    if (isFunction(onNext)) {
      return Subscriber.of(
        (value: T) => {
          !this._isOperating && onNext(value);
        },
        (isFunction(onError) && onError) || undefined,
        (isFunction(onComplete) && onComplete) || undefined
      );
    }
    return onNext;
  }

  private _doComplete(subscriber: Subscriber<T>) {
    if (this._isComplete) {
      subscriber.onComplete(this._error ?? this._innerValue);
    }
  }

  private _doError(subscriber: Subscriber<T>) {
    if (!this._isComplete && !!this._error) {
      subscriber.onError(this._error);
    }
  }

  private _doNext(subscriber: Subscriber<T>) {
    if (this._isStarted && !this._isComplete && !this._error) {
      subscriber.onNext(this._innerValue as T);
    }
  }

  private _callSubscribers(event: T, ...subscribers: Subscriber<T>[]): void {
    subscribers.forEach((s) => s.onNext(event));
  }

  private _computeValue(
    initValue: T,
    ...operations: OperatorFunction<T, Promise<any>>[]
  ): Promise<any> | T {
    if (operations.length > 0) {
      return operations
        .slice(1)
        .reduce(
          async (promise: Promise<any>, fn) =>
            await Promise.resolve(promise).then((val) => fn(val)),
          operations[0](initValue)
        );
    } else {
      return initValue;
    }
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
    operations: OperatorFunction<T, any>[]
  ): Promise<any> {
    this._isOperating = true;
    const computedValue = this._computeValue(
      value as T,
      ...(filterNonFunctions(...operations) as OperatorFunction<T>[])
    );

    return Promise.resolve(computedValue)
      .finally(() => (this._isOperating = false))
  }
}
