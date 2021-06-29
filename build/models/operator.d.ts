export interface Operator<T = any, U = any> {
    (operatorCallback: OperatorCallback<T, U>): OperatorFunction<T>;
}
export declare type OperatorCallback<T, U> = (t: T) => U;
export declare type OperatorFunction<T, U = T> = (source: T) => U;
