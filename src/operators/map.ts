import { Operator, OperatorCallback, OperatorFunction } from "../models/operator";

export const map = function<T = any, U = T>(f: OperatorCallback<T, U>): OperatorFunction<T, U> {
    return (source) => {
        return f(source);
    }
}