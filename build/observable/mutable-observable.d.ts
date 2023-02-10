import { OperatorFunction, OperationResult } from "../models/operator";
import { OnNext, Subscriber, Subscription } from "../models/subscription";
import { Types } from "../models/types";
import { Observable } from "./observable";
export declare class MutableObservable<T = never> extends Observable<T> implements Types.MutableObservable<T> {
    private _preProcessOperations;
    constructor(...initialSequence: T[]);
    close(): this;
    /**
     * @param operations
     * @returns this
     */
    compile(...operations: OperatorFunction<T, OperationResult<any>>[]): this;
    next(...events: T[]): this;
    subscribe(subscriber?: Subscriber<T> | OnNext<T> | undefined): Subscription;
    private _buildNewSequence;
    private _triggerExecution;
}
