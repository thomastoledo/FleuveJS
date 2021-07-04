import { FilterError } from "./models/errors";
import {
  Subscriber,
  Listener,
  EventSubscription,
} from "./models/event";
import { OperatorFunction } from "./models/operator";

export class Fleuve<T = never> {
  private readonly _subscribers: Subscriber<T>[] = [];

  private _parent$?: Fleuve<any>;
  private _preProcessOperations: OperatorFunction<T, any>[] = [];

  private _isStarted: boolean = false;

  constructor(private _innerValue?: T) {
    this._isStarted = this._isValueDefined(this._innerValue);
  }

  next(...events: T[]) {
    events.forEach((event: T) => {
      const value = event;
      if (!this._isStarted) {
        this._isStarted = this._isValueDefined(value);
      }

      if (this._isStarted) {
        this._innerValue = value;
        this._callSubscribers(event);
      }
    });
  }

  pipe<U = any>(...operations: OperatorFunction<T>[]): Fleuve<U> {
    const fleuve$ = new Fleuve<any>();
    if (this._isStarted) {
      try {
        const value = this._computeValue(
          this._innerValue as T,
          ...this._filterNonFunctions(...operations)
        );
        fleuve$.next(value);
      } catch (err) {
        if (err instanceof FilterError) {
          fleuve$._isStarted = false;
          fleuve$.next(undefined);
        }
      }
    }
    return fleuve$;
  }

  subscribe(subscriber: Subscriber<T>) {
    if (!this._isFunction(subscriber)) {
      throw new Error("Please provide a function");
    }

    this._subscribers.push(subscriber);
    if (this._isStarted) {
      subscriber(this._innerValue as T);
    }
  }

  fork(...operators: OperatorFunction<T>[]): Fleuve<T> {
    const fork$: Fleuve<T> = new Fleuve();
    fork$._parent$ = this;
    fork$._preProcessOperations = operators;

    this.subscribe((value: T) => {
      try {
        fork$.next(fork$._computeValue(value, ...fork$._preProcessOperations));
      } catch {}
    });
    return fork$;
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

    const eventListener: EventListener = (event: Event) => listener(this._innerValue as T, event);

    elem.addEventListener(eventType, eventListener, options);

    return new EventSubscription(elem, eventType, eventListener);
  }

  private _isValueDefined(value: T | undefined): value is T {
    return value !== undefined;
  }
  
  private _filterNonFunctions(...fns: any[]): OperatorFunction<T>[] {
    return fns.filter((f) => this._isFunction(f));
  }

  private _isFunction(fn: any): fn is Function {
    return typeof fn === "function";
  }

  private _callSubscribers(event: T): void {
    this._subscribers.forEach((s) => s(event));
  }

  private _computeValue(initValue: T, ...operations: OperatorFunction<T>[]) {
    if (operations.length > 0) {
      return operations
        .slice(1)
        .reduce((val, fn) => fn(val), operations[0](initValue));
    }
  }
}
