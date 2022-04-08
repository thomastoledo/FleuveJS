import { Observable } from "./observable";
import { isFunction } from "../helpers/function.helper";
import { OperatorFunction, OperationResult, OperationResultFlag } from "../models/operator";
import {
  isInstanceOfSubscriber,
  OnNext,
  Subscriber,
  subscriberOf,
  Subscription,
} from "../models/subscription";
import { Types } from "../models";

export class ObservableFork<T> extends Observable<T> implements Types.ObservableFork<T> {
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
      next: (value) => {
        this._subscribers.forEach(
          (s) =>
            {
              if (s.next) {
                const result = this._executeOperations<T, T>(value, operators);
                if (!result.isFilterNotMatched() && !result.isMustStop()) {
                  return s.next(result.value)
                }

                if (result.isMustStop()) {
                  this.close();
                }
              } 
          }
        );
      },
      error: (err) => {
        this._error = err;
        this._subscribers.forEach((s) => s.error && s.error(err));
      },

      complete: () => {
        this._isComplete = true;
        this.unsubscribe();
        this._subscribers.forEach((s) => s.complete && s.complete());
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
    const sourceSequence = (this.sourceObs$ as any)._innerSequence; // FIXME ew
    for (let i = 0, l = sourceSequence.length; i < l; i++ ) {
      try {
        newSequence.push(this._executeOperations(sourceSequence[i].value, this.operators));
      } catch (error) {
        newSequence.push(new OperationResult(sourceSequence[i].value, OperationResultFlag.OperationError, error as Error));
        i = l;
      }
    }

    this.executeSubscriber(
      _subscriber,
      newSequence
    );

    return new Subscription(
      () =>
        (this._subscribers = this._subscribers.filter((s) => s !== subscriber))
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
