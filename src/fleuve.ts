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
  private _forkOperations: OperatorFunction<T | undefined>[] = [];
  private _skipValue: boolean = false;

  constructor(private _innerSource?: T) {}

  next(...events: T[] | NextCallback<T>[]) {
    const onlyFunctions = (events as Array<T | NextCallback<T>>).every(
      (event) => this.isFunction(event)
    );
    const onlyScalar = (events as Array<T | NextCallback<T>>).every(
      (event) => !this.isFunction(event)
    );

    if (!onlyFunctions && !onlyScalar) {
      throw new Error(
        "Please provide either only scalar values or only functions"
      );
    }

    events.forEach((event: T | NextCallback<T>) => {
      let res;
      if (this.isFunction(event)) {
        res = (event as NextCallback<T | undefined>)(
          this._innerSource
        );
      } else {
        res = event as T;
      }
      try {
        this._innerSource = this._forkOperations.reduce((val, f) =>f(val), res);
        this._skipValue = false;
        this.subscribers.forEach((f) => f(this._innerSource));
      } catch (err) {
        this._skipValue = err instanceof FilterError;
      }
    });
  }

  subscribe(subscriber: Subscriber<T | undefined>) {
    if (!this.isFunction(subscriber)) {
      throw new Error("Please provide a function");
    }
    this.subscribers.push(subscriber);
    if (!this._skipValue) {
      subscriber(this._innerSource);
    }
  }

  pipe(...functions: OperatorFunction<T>[]) {
    const fns = this.filterNonFunctions(...functions);
    const fleuve$ = new Fleuve();
    if (fns.length > 0) {
      try {
        const res = fns
          .slice(1)
          .reduce((val, fn) => fn(val), fns[0](this._innerSource));
        fleuve$.next(res);
      } catch (err) {
        fleuve$._skipValue =  err instanceof FilterError;
      }
    }
    return fleuve$;
  }

  fork(...operators: OperatorFunction<T>[]): IFleuve {
    const fork$: Fleuve = new Fleuve();
    fork$._parent$ = this;
    fork$._forkOperations = operators;

    this.subscribe((value: T | undefined) => {fork$.next(value)});
    return fork$;
  }

  addEventListener(
    selector: string,
    eventType: string,
    listener: Listener<T | undefined>,
    options: AddEventListenerOptions
  ) {
    const elem = document.querySelector(selector);

    if (!elem) {
      throw new Error(`Could not find any element with selector "${selector}"`);
    }

    const eventListener: EventListener = (event: Event) =>
      listener(this._innerSource, event);

    elem.addEventListener(eventType, eventListener, options);

    return new EventSubscription(elem, eventType, eventListener);
  }

  private filterNonFunctions(...fns: any[]): Function[] {
    return fns.filter((f) => this.isFunction(f));
  }

  private isFunction(fn: any): boolean {
    return typeof fn === "function";
  }
}
