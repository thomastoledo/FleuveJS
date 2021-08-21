export type OperatorFunction<T, U = never> = (source: T) => U;

export class OperationResult<T> {
    constructor(private _value: T, private _flag?: OperationResultFlag) {}

    get value() {
        return this._value;
    }

    get flag() {
        return this._flag;
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
}

export enum OperationResultFlag {
    UnwrapSwitch,
    MustStop,
    FilterNotMatched
}