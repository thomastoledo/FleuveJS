import { Observable } from "../../../observable/observable";

export const of = function<T = never>(value: T): Observable<T> {
    const obs$ = new Observable(value);
    obs$.close();
    return obs$;
}