import { Observable } from "./observable";
import { isFunction } from "../helpers/function.helper";
import {
  OperatorFunction,
  OperationResult,
  OperationResultFlag,
} from "../models/operator";
import {
  isInstanceOfSubscriber,
  OnComplete,
  OnError,
  OnNext,
  Subscriber,
  subscriberOf,
  Subscription,
} from "../models/subscription";
import { Types } from "../models";

export class ObservableFork<T>
  extends Observable<T>
  implements Types.ObservableFork<T>
{
  private subscriptions: Subscription[] = [];
  private operators: OperatorFunction<T, OperationResult<any>>[] = [];

  constructor(
    private sourceObs$: Observable<T>,
    ...operators: OperatorFunction<T, OperationResult<any>>[]
  ) {
    super();
    this.operators = operators;
    this._isComplete = (sourceObs$ as any)._isComplete;

    this.sourceObs$.subscribe({
      name: 'subscriber fork constructor',
      next: (value) => {
        this._subscribers
          .filter((s) => s.next)
          .forEach((s) => {
            const result = this._executeOperations<T, T>(value, operators);
            if (!result.isFilterNotMatched() && !result.isMustStop()) {
              return (s.next as OnNext<T>)(result.value);
            }

            if (result.isMustStop()) {
              this.close();
            }
          });
      },
      error: (err) => {
        this._error = err;
        this._subscribers
          .filter((s) => s.error)
          .forEach((s) => (s.error as OnError)(err));
      },

      complete: () => {
        this._isComplete = true;
        this.unsubscribe();
        this._subscribers
          .filter((s) => s.complete)
          .forEach((s) => (s.complete as OnComplete)());
      },
    });
  }

  subscribe(subscriber: Subscriber<T> | OnNext<T>): Subscription {
    if (!isFunction(subscriber) && !isInstanceOfSubscriber(subscriber)) {
      throw new Error("Please provide either a function or a Subscriber");
    }

    let _subscriber: Subscriber<T> = !isInstanceOfSubscriber(subscriber)
      ? subscriberOf(subscriber)
      : subscriber;

    this._subscribers.push(_subscriber);

    const newSequence: OperationResult<T>[] = [];
    const sourceSequence = (this.sourceObs$ as any)._innerSequence as OperationResult<T>[]; // FIXME ew

    for (let i = 0, l = sourceSequence.length; i < l; i++) {
      try {
        if (sourceSequence[i].isOperationError()) {
          throw sourceSequence[i].error;
        }
        newSequence.push(
          this._executeOperations(sourceSequence[i].value, this.operators)
        );
      } catch (error) {
        newSequence.push(
          new OperationResult(
            sourceSequence[i].value,
            OperationResultFlag.OperationError,
            error as Error
          )
        );
        i = l;
      }
    }

    this.executeSubscriber(_subscriber, newSequence);

    return new Subscription(
      () =>
        (this._subscribers = this._subscribers.filter(
          (s) => s !== subscriber
        ))
    );
  }

  close() {
    this._subscribers.forEach((s) => s.complete && s.complete());
    this.unsubscribe();
  }

  private unsubscribe() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
