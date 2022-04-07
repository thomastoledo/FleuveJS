import {
  OperatorFunction,
  OperationResult,
  OperationResultFlag,
} from "../models/operator";
import { Subscriber } from "../models/subscription";
import { Observable } from "./observable";

export class MutableObservable<T = never> extends Observable<T> {
  private _preProcessOperations: OperatorFunction<T, any>[] = [];

  constructor(...initialSequence: T[]) {
    super(...initialSequence);
    this._isComplete = false;
  }

  close(): void {
    if (this._isComplete) {
      return;
    }

    this._isComplete = true;
    this._subscribers.forEach((s) => {
      if (s.complete) {
        s.complete();
      }
    });
  }

  /**
   * @param operations
   * @returns this
   */
  compile(...operations: OperatorFunction<T, OperationResult<any>>[]): this {
    if (this._isComplete) {
      return this;
    }

    const newSequence = this._buildNewSequence(
      this._innerSequence.filter((event) => !event.isOperationError()).map((event) => event.value),
      operations
    );

    const idxError = newSequence.findIndex((opRes) => opRes.isOperationError());
    if (idxError > -1) {
      this._innerSequence = newSequence.slice(0, idxError);
      this.next(...this._innerSequence.map((event) => event.value));

      this._innerSequence.push(newSequence[idxError]);
      this._triggerExecution([newSequence[idxError]], this._subscribers);
      return this;
    }

    return this.next(...(this._innerSequence = newSequence).map((event) => event.value));
  }

  next(...events: T[]): this {
    if (this._isComplete) {
      return this;
    }

    this._innerSequence = this._buildNewSequence(
      events,
      this._preProcessOperations
    );
    this._triggerExecution(this._innerSequence, this._subscribers);
    return this;
  }

  private _buildNewSequence(
    events: T[],
    operations: OperatorFunction<T, any>[]
  ): OperationResult<T>[] {
    const newSequence = [];
    for (let i = 0, l = events.length; i < l; i++) {
      try {
        const operationResult = this._executeOperations(events[i], operations);
        console.log('OPERATION RESULT', operationResult);
        if (operationResult.isMustStop()) {
          // this._isComplete = true;
          newSequence.push(operationResult);
          break;
        }

        if (!operationResult.isFilterNotMatched()) {
          newSequence.push(operationResult);
        }
      } catch (error: any) {
        this._error = error;
        newSequence.push(
          new OperationResult(
            events[i],
            OperationResultFlag.OperationError,
            error
          )
        );
        i = l; // Do we really want to stop the whole stream if there is an error?
      }
    }
    return newSequence;
  }

  private _triggerExecution(
    sequence: OperationResult<T>[],
    subscribers: Subscriber<T>[]
  ): void {
    subscribers.forEach((s) => this.executeSubscriber(s, sequence));
  }
}
