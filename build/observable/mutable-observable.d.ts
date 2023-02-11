import { OperatorFunction, OperationResult } from "../models/operator";
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
    private _buildNewSequence;
    private _triggerExecution;
}
