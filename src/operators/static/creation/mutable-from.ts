import { MutableObservable } from "../../../observable";

export const mutableFrom = function<T = never>(values: T[]): MutableObservable<T> {
    return new MutableObservable(...values);
}