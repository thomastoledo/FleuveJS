import { OperatorFunction, OperationResult } from "../models/operator";
import { Subscriber } from "../models/subscription";
import { Observable } from "./observable";

export class MutableObservable<T = never> extends Observable<T> {
  private _preProcessOperations: OperatorFunction<T, any>[] = [];


  constructor(...initialSequence: T[]) {
    super(...initialSequence);
    // this._isComplete = false;
  }

//   close(): void {
//     this._complete();
//     this._triggerOnComplete();
//   }

  /**
   * @param operations
   * @returns this
   */
//   compile(...operations: OperatorFunction<T, OperationResult<any>>[]): this {
//     if (this._isComplete || !!this._error) {
//       return this;
//     }
//     const newSequence = this._buildNewSequence(this._innerSequence, operations);
//     this.next(...newSequence);
//     return this;
//   }

  next(...events: T[]): this {
    // if (this._isComplete || !!this._error) {
    //   return this;
    // }

    
    this._innerSequence = this._buildNewSequence(events, this._preProcessOperations);
    // this._triggerOnNext(this._innerSequence, this._subscribers);
    // this._triggerOnError();
    // this._triggerOnComplete();
    return this;
  }

  private _buildNewSequence(events: T[], operations: OperatorFunction<T, any>[]): OperationResult<T>[] {
    const newSequence = [];
    for (let i = 0; i < events.length; i++) {
      try {
        const operationResult = this._executeOperations(
          events[i],
          operations
        );
  
        if (operationResult.isMustStop()) {
        //   this.close();
          break;
        }
  
        if (operationResult.isFilterNotMatched()) {
          break;
        }

        newSequence.push(operationResult);        
      } catch (error: any) {
        // this._error = error;
        // this._triggerOnError();
        // this.close();
      }

    }
    return newSequence;
  }
  // private _triggerOnNext(events: T[], subscribers: Subscriber<T>[]): void {
  //   events.forEach(event => subscribers.forEach(s => s.next(event)));
  // }
}
