import { OperatorFunction, OperationResult } from "../models/operator";
import { Observable } from "./observable";
export declare class MutableObservable<T = never> extends Observable<T> {
    private _forks$;
    private _preProcessOperations;
    constructor(...initialSequence: T[]);
    close(): void;
    closeForks(): void;
    /**
     * @param operations
     * @returns
     */
    compile(...operations: OperatorFunction<T, OperationResult<any>>[]): this;
    fork(...operators: OperatorFunction<T, OperationResult<any>>[]): Observable<T>;
    next(...events: T[]): this;
    private _buildNewSequence;
    private _triggerOnNext;
}
