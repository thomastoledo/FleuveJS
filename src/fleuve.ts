import { IFleuve } from "./models";
import { FilterError } from "./models/errors";
import {
  NextCallback,
  Subscriber,
  Listener,
  EventSubscription,
} from "./models/event";
import { OperatorFunction } from "./models/operator";

export class Fleuve<T = any> implements IFleuve {
  private readonly subscribers: Function[] = [];

  private _parent$?: IFleuve;
  private _preProcessOperations: OperatorFunction<T | undefined>[] = [];
  private _isError: boolean = false;

  constructor(private _innerSource?: T) {}

  next(...events: T[] | NextCallback<T>[]) {
    this._isOnlyFunctionsOrOnlyScalars(events);
    events.forEach((event: T | NextCallback<T>) => {
      try {
        this._innerSource = this._preProcessOperations.reduce(
          (val, f) => f(val),
          this._nextEvent(event)
        );
        this._isError = false;
        this.subscribers.forEach((f) => f(this._innerSource));
      } catch {
        this._isError = true;
      }
    });
  }

  subscribe(subscriber: Subscriber<T | undefined>) {
    if (!this._isFunction(subscriber)) {
      throw new Error("Please provide a function");
    }
    this.subscribers.push(subscriber);
    if (!this._isError) {
      subscriber(this._innerSource);
    }
  }

  pipe(...operations: OperatorFunction<T>[]) {
    const fleuve$ = new Fleuve();
    try {
      const value = this._computeValue(...this._filterNonFunctions(...operations));
      fleuve$.next(value);
    } catch {
      fleuve$._isError = true;
    }
    return fleuve$;
  }

  fork(...operators: OperatorFunction<T>[]): IFleuve {
    const fork$: Fleuve = new Fleuve();
    fork$._parent$ = this;
    fork$._preProcessOperations = operators;

    this.subscribe((value: T | undefined) => {
      fork$.next(value);
    });
    return fork$;
  }

  addEventListener(
    selector: string,
    eventType: string,
    listener: Listener<T | undefined>,
    options: AddEventListenerOptions
  ): EventSubscription {
    const elem = document.querySelector(selector);

    if (!elem) {
      throw new Error(`Could not find any element with selector "${selector}"`);
    }

    const eventListener: EventListener = (event: Event) => listener(this._innerSource, event);

    elem.addEventListener(eventType, eventListener, options);

    return new EventSubscription(elem, eventType, eventListener);
  }

  private _filterNonFunctions(...fns: any[]): OperatorFunction<T | undefined>[] {
    return fns.filter((f) => this._isFunction(f));
  }

  private _isFunction(fn: any): boolean {
    return typeof fn === "function";
  }

  private _isOnlyFunctionsOrOnlyScalars(events: T[] | NextCallback<T>[]): void {
    const onlyFunctions = (events as Array<T | NextCallback<T>>).every(
      (event) => this._isFunction(event)
    );
    const onlyScalar = (events as Array<T | NextCallback<T>>).every(
      (event) => !this._isFunction(event)
    );

    if (!onlyFunctions && !onlyScalar) {
      throw new Error(
        "Please provide either only scalar values or only functions"
      );
    }
  }

  private _nextEvent(event: T | NextCallback<T>) {
    let res;
    if (this._isFunction(event)) {
      res = (event as NextCallback<T | undefined>)(this._innerSource);
    } else {
      res = event as T;
    }
    return res;
  }

  private _computeValue(...operations: OperatorFunction<T | undefined>[]) {
    if (operations.length > 0) {
      return operations
        .slice(1)
        .reduce((val, fn) => fn(val), operations[0](this._innerSource));
    }
  }
}
