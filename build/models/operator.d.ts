export type OperatorFunction<T, U = never> = (source: T) => U;
export declare class OperationResult<T> {
    private _value;
    private _flag?;
    private _error?;
    constructor(_value: T, _flag?: OperationResultFlag | undefined, _error?: Error | undefined);
    get value(): T;
    get flag(): OperationResultFlag | undefined;
    get error(): Error | undefined;
    isUnwrapSwitch(): boolean;
    isMustStop(): boolean;
    isFilterNotMatched(): boolean;
    isOperationError(): boolean;
}
export declare enum OperationResultFlag {
    UnwrapSwitch = "UnwrapSwitch",
    MustStop = "MustStop",
    FilterNotMatched = "FilterNotMatched",
    OperationError = "OperationError"
}
