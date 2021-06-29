
import { FilterError } from "../models/errors";
import { OperatorCallback, OperatorFunction } from "../models/operator";

export const filter = function<T = any>(f: OperatorCallback<T, boolean>): OperatorFunction<T> {
    return (source) => {
        if (f(source)) {
            return source;
        }
        throw new FilterError();
    }
}