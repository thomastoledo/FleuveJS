import { EventSubscription, Listener, NextCallback, Subscriber } from "./event";
import { OperatorFunction } from "./operator";

export interface IFleuve<T = any> {
  next(...events: T[] | NextCallback<T>[]): void;

  subscribe(subscriber: Subscriber<T>): void;

  pipe(...functions: OperatorFunction<T>[]): IFleuve<any>;

  addEventListener(
    selector: string,
    eventType: string,
    listener: Listener<T>,
    options: AddEventListenerOptions
  ): EventSubscription;
}
