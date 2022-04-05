import { Observable } from "../../../observable";

export const of = function<T = never>(...values: T[]): Observable<T> {
    return new Observable(...values);
}