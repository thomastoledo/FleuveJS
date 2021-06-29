import { IFleuve } from "./models";
import { NextCallback, Subscriber, Listener, EventSubscription } from "./models/event";
import { OperatorFunction } from "./models/operator";

export class Fleuve<T = any> implements IFleuve {
  private readonly subscribers: Function[] = [];

  constructor(private _innerSource?: T) {}

  next = (...events: T[] | NextCallback<T>[]) => {
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
      if (this.isFunction(event)) {
        this._innerSource = (event as NextCallback<T | undefined>)(this._innerSource);
      } else {
        this._innerSource = event as T;
      }
      this.subscribers.forEach((f) => f(this._innerSource));
    });
  };

  subscribe = (subscriber: Subscriber<T | undefined>) => {
    if (!this.isFunction(subscriber)) {
      throw new Error("Please provide a function");
    }
    this.subscribers.push(subscriber);
    subscriber(this._innerSource);
  };

  pipe = (...functions: OperatorFunction<T>[]) => {
    const fns = this.filterNonFunctions(...functions);
    const fleuve$ = new Fleuve();
    if (fns.length > 0) {
      try {
        const res = fns
          .slice(1)
          .reduce((val, fn) => fn(val), fns[0](this._innerSource));
          fleuve$.next(res);
      } catch {}
    }
    return fleuve$;
  };

  addEventListener = (
    selector: string,
    eventType: string,
    listener: Listener<T | undefined>,
    options: AddEventListenerOptions
  ) => {
    const elem = document.querySelector(selector);

    if (!elem) {
      throw new Error(`Could not find any element with selector "${selector}"`);
    }

    const eventListener: EventListener = (event: Event) =>
      listener(this._innerSource, event);

    elem.addEventListener(eventType, eventListener, options);

    return new EventSubscription(elem, eventType, eventListener);
  };

  private filterNonFunctions = (...fns: any[]) =>
    fns.filter((f) => this.isFunction(f));

  private isFunction = (fn: any) => typeof fn === "function";
}
