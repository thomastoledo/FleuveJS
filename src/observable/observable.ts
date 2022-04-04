import { filterNonFunctions, isFunction } from "../helpers/function.helper";
import {
  OperationResult,
  OperationResultFlag,
  OperatorFunction,
} from "../models/operator";
import {
  isInstanceOfSubscriber,
  subscriberOf,
  OnComplete,
  OnError,
  OnNext,
  Subscriber,
  Subscription,
} from "../models/subscription";

export class Observable<T = never> {

  protected _innerSequence: OperationResult<T>[];
  protected _subscribers: Subscriber<T>[] = [];
  protected _isComplete: boolean = true;
  protected _error!: Error;

  constructor(...initialSequence: T[]) {
    this._innerSequence = initialSequence.map(
      (value) => new OperationResult(value)
    );
  }

  pipe<U = any>(
    ...operations: OperatorFunction<T, OperationResult<U>>[]
  ): Observable<U> {
    const obs$ = new Observable<U>();

    const newSequence: OperationResult<U>[] = [];
    for (
      let i = 0, l = this._innerSequence.length;
      i < l && !this._innerSequence[i].isMustStop();
      i++
    ) {

      const operationResult = this._executeOperations(
        this._innerSequence[i].value,
        operations
      );

      if (!operationResult.isFilterNotMatched()) {
        newSequence.push(operationResult);
      }
    }
    obs$._innerSequence = newSequence;
    return obs$;
  }

  subscribe(subscriber: OnNext<T> | Subscriber<T>): Subscription {
    if (!isFunction(subscriber) && !isInstanceOfSubscriber(subscriber)) {
      throw new Error("Please provide either a function or a Subscriber");
    }

    let _subscriber: Subscriber<T> = !isInstanceOfSubscriber(subscriber)
      ? subscriberOf(subscriber)
      : subscriber;
    this._subscribers.push(_subscriber);
    this.executeSubscriber(_subscriber, this._innerSequence);

    return new Subscription(
      () =>
        (this._subscribers = this._subscribers.filter((s) => s !== subscriber))
    );
  }

  protected executeSubscriber(
    _subscriber: Subscriber<T>,
    sequence: OperationResult<T>[]
  ): void {
    for (let i = 0, l = sequence.length; i < l; i++) {
      let operationResult = sequence[i];

      if (operationResult.isOperationError()) {
        this._error = operationResult.error as Error;
        (_subscriber.error || (() => {throw operationResult.error}))(operationResult.error as Error);
        break;
      }
      
      if (operationResult.isFilterNotMatched() || operationResult.isMustStop()) {
        return;
      }

      _subscriber.next && _subscriber.next(operationResult.value);
    }
    this._isComplete && _subscriber.complete && _subscriber.complete();
  }

  private _computeValue<T>(
    initValue: T,
    ...operations: OperatorFunction<T, OperationResult<any>>[]
  ): OperationResult<any> {
    let res: OperationResult<any> = new OperationResult(initValue);
    for (let i = 0; i < operations.length; i++) {
      res = operations[i](res.value);
      switch (res.flag) {
        case OperationResultFlag.FilterNotMatched:
        case OperationResultFlag.MustStop:
          i = operations.length;
          break;
        case OperationResultFlag.UnwrapSwitch:
          res = new OperationResult(res.value._innerSequence.pop()?.value);
          break;
        default:
          break;
      }
    }
    return res;
  }

  protected _executeOperations<T, U = any>(
    value: T,
    operators: OperatorFunction<T, OperationResult<U>>[]
  ): OperationResult<U> {
    const computedValue = this._computeValue(
      value as T,
      ...(filterNonFunctions(...operators) as OperatorFunction<
        T,
        OperationResult<U>
      >[])
    );
    return computedValue;
  }
}
