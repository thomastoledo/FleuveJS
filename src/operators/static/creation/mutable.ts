import { MutableObservable } from "../../../observable";

export const mutable = function<T = never>(...values: T[]): MutableObservable<T> {
    return new MutableObservable(...values);
}