import { isFunction } from "../helpers/function.helper";
import {
  isInstanceOfSubscriber,
  OnNext,
  Subscriber,
  subscriberOf,
  Subscription,
  Types,
} from "../models";
import {
  OperationResult,
  OperationResultFlag,
  OperatorFunction,
} from "../models/operator";
import { fork } from "../operators";
import { Observable } from "./observable";

export class PromiseObservable<T>
  extends Observable<T>
  implements Types.PromiseObservable<T>
{
  private promise: Promise<void>;

  constructor(promise: Promise<T>) {
    super();
    this.promise = promise
      .then((res: T) => {
        this._innerSequence.push(new OperationResult(res));
      })
      .catch((err: Error) => {
        this._innerSequence.push(
          new OperationResult(
            void 0 as any,
            OperationResultFlag.OperationError,
            err
          )
        );
      });
  }

  pipe<U = any>(
    ...operations: OperatorFunction<T, OperationResult<U>>[]
  ): Observable<U> {
    return fork(this, ...operations);
  }

  subscribe(subscriber: Subscriber<T> | OnNext<T>): Subscription {
    if (!isFunction(subscriber) && !isInstanceOfSubscriber(subscriber)) {
      throw new Error("Please provide either a function or a Subscriber");
    }

    let _subscriber: Subscriber<T> = !isInstanceOfSubscriber(subscriber)
      ? subscriberOf(subscriber)
      : subscriber;
    this._subscribers.push(_subscriber);

    const handler = () => this.executeSubscriber(_subscriber, this._innerSequence);
    this.promise.finally(handler);
    return new Subscription(
      () =>
        (this._subscribers = this._subscribers.filter((s) => s !== subscriber))
    );
  }
}
