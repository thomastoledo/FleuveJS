export type OperatorFunction<T, U = never> = (source: T) => U;

export class OperationResult<T> {
    constructor(private _value: T, private _flag?: OperationResultFlag, private _error?: Error) {}

    get value() {
        return this._value;
    }

    get flag() {
        return this._flag;
    }

    get error() {
        return this._error;
    }

    isUnwrapSwitch(): boolean {
        return this._flag === OperationResultFlag.UnwrapSwitch;
    }

    isMustStop(): boolean {
        return this._flag === OperationResultFlag.MustStop;
    }

    isFilterNotMatched(): boolean {
        return this._flag === OperationResultFlag.FilterNotMatched;
    }

    isOperationError(): boolean {
        return this._flag === OperationResultFlag.OperationError
    }

    static unwrap<U = any>(operation: OperationResult<OperationResult<U> | U>): OperationResult<U> {
        if (operation.isUnwrapSwitch()) {
            return operation._value as OperationResult<U>;
        }
        return operation as OperationResult<U>;
    }
}

export enum OperationResultFlag {
    UnwrapSwitch,
    MustStop,
    FilterNotMatched,
    OperationError,
}