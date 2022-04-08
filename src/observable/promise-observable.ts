import { OperationResult, OperationResultFlag } from "../models/operator";
import { Observable } from "./observable";

export class PromiseObservable<T> extends Observable<T> {
    constructor(promise: Promise<T>) {
        super();
        promise
        .then((res: T) => {
            this._innerSequence.push(new OperationResult(res));
        })
        .catch((err: Error) => {
            this._innerSequence.push(new OperationResult(void 0 as any, OperationResultFlag.OperationError, err));
        })
        .finally(() => this._subscribers.forEach((s) => this.executeSubscriber(s, this._innerSequence)))
    }
}