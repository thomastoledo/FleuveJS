import { FilterError } from "./models/errors";
import { Subscriber, Listener, EventSubscription } from "./models/event";
import { Operator, OperatorFunction } from "./models/operator";

export class Fleuve<T = never> {
  private readonly _subscribers: Subscriber<T>[] = [];

  private _preProcessOperations: OperatorFunction<T, any>[] = [];

  private _isStarted: boolean = false;
  private _isComplete: boolean = false;

  private _forks$: Fleuve<T>[] = [];

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

  dam(): void {
    // TODO - TTO: rajouter un onError et un onComplete sur les subscribers pour pouvoir tous les exécuter
    this._forks$.forEach((fork$) => {
      fork$.dam();
      fork$._complete();
    });
  }

  fork(...operators: OperatorFunction<T>[]): Fleuve<T> {
    const fork$: Fleuve<T> = new Fleuve();
    fork$._preProcessOperations = operators;

    this.subscribe((value: T) => {
      try {
        const nextValue = fork$._computeValue(
          value,
          ...fork$._preProcessOperations
        );
        fork$.next(nextValue);
      } catch (err) {
        if (!(err instanceof FilterError)) {
          throw err;
        }
      }
    });
    
    this._forks$.push(fork$);
    return fork$;
  }

  next(...events: T[]): this {
    if (!this._isComplete) {
      if (!this._isStarted) {
        this._isStarted = arguments.length > 0;
      }
  
      if (this._isStarted) {
        events.forEach((event: T) => {
          this._innerValue = event;
          this._callSubscribers(event);
        });
      }
    }


    return this;
  }

  pile(...operations: OperatorFunction<T>[]): this {
    try {
      const value = this._computeValue(
        this._innerValue as T,
        ...this._filterNonFunctions(...operations)
      );
      this.next(value);
    } catch (err) {
      if (!(err instanceof FilterError)) {
        throw err;
      }
    }
    return this;
  }

  pipe<U = any>(...operations: OperatorFunction<T>[]): Fleuve<U> {
    const fleuve$ = new Fleuve<U>();
    if (this._isStarted) {
      try {
        const value = this._computeValue(
          this._innerValue as T,
          ...this._filterNonFunctions(...operations)
        );
        fleuve$.next(value);
      } catch (err) {
        if (!(err instanceof FilterError)) {
          throw err;
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

  private _filterNonFunctions(...fns: any[]): OperatorFunction<T>[] {
    return fns.filter((f) => this._isFunction(f));
  }

  private _isFunction(fn: any): fn is Function {
    return typeof fn === "function";
  }

  private _callSubscribers(event: T): void {
    this._subscribers.forEach((s) => s(event));
  }

  private _computeValue(
    initValue: T,
    ...operations: OperatorFunction<T>[]
  ): any {
    if (operations.length > 0) {
      return operations
        .slice(1)
        .reduce((val, fn) => fn(val), operations[0](initValue));
    } else {
      return initValue;
    }
  }

  private _createEventListenerFromListener(
    listener: Listener<T>
  ): EventListener {
    return (event: Event) => listener(this._innerValue as T, event);
  }

  private _complete() {
    this._isComplete = true;
  }
}
