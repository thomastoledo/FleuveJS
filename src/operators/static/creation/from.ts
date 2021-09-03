import { Observable } from "../../../observable/observable";

export const from = function<T = never>(values: T[]): Observable<T> {
    const obs$ = new Observable(...values);
    obs$.close();
    return obs$;
}