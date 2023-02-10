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
  private _isClosed: boolean = false;

  protected get innerSequence(): OperationResult<T>[] {
      return (this.sourceObs$ as any).innerSequence;
  }

  protected set innerSequence(sequence: OperationResult<T>[]) {
    this._innerSequence = sequence;
}

  constructor(
    private sourceObs$: Types.Observable<T>,
    ...operators: OperatorFunction<T, OperationResult<any>>[]
  ) {
    super();
    this.operators = operators;
    this._isComplete = (sourceObs$ as any)._isComplete;
    (this.sourceObs$ as any)._forks.push(this);

    this.sourceObs$.subscribe({
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

  subscribe(subscriber?: Subscriber<T> | OnNext<T> | undefined): Subscription {
    if (subscriber === undefined) {
      //TODO - TTO: might be useful not to assign a default one but rather a new empty one each time
      subscriber = ObservableFork.DEFAULT_SUBSCRIBER;
    }

    if (!isFunction(subscriber) && !isInstanceOfSubscriber(subscriber)) {
      throw new Error("Please provide either a function or a Subscriber");
    }

    let _subscriber: Subscriber<T> = !isInstanceOfSubscriber(subscriber)
      ? subscriberOf(subscriber)
      : subscriber;

    this._subscribers.push(_subscriber);

    const newSequence: OperationResult<T>[] = [];
    const sourceSequence = (this.sourceObs$ as any).innerSequence as OperationResult<T>[]; // FIXME ew

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

    if (this._isClosed) {
      (_subscriber.complete && _subscriber.complete());
    } else {
      this.executeSubscriber(_subscriber, newSequence);
    }


    return new Subscription(
      () =>
        (this._subscribers = this._subscribers.filter(
          (s) => s !== subscriber
        ))
    );
  }

  close() {
    this._isClosed = true;
    this._forks.forEach((fork) => fork.close());
    this._subscribers.forEach((s) => s.complete && s.complete());
    this.unsubscribe();
  }

  private unsubscribe() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
