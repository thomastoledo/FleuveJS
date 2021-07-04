export interface Operator<T = any, U = any> {
    (operatorCallback: OperatorCallback<T, U>) : OperatorFunction<T>;
}

export type OperatorCallback<T, U> = (t: T) => U;
export type OperatorFunction<T, U = any> = (source: T) => U;