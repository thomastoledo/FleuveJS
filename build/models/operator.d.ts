export declare type OperatorFunction<T, U = never> = (source: T) => U;
export declare class OperationResult<T> {
    private _value;
    private _flag?;
    constructor(_value: T, _flag?: OperationResultFlag | undefined);
    get value(): T;
    get flag(): OperationResultFlag | undefined;
    isUnwrapSwitch(): boolean;
    isMustStop(): boolean;
    isFilterNotMatched(): boolean;
}
export declare enum OperationResultFlag {
    UnwrapSwitch = 0,
    MustStop = 1,
    FilterNotMatched = 2
}
