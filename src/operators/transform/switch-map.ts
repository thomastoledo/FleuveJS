import { Fleuve } from "../../fleuve/fleuve";
import { OperatorFunction } from "../../models/operator";

export function switchMap<T = any, U = T>(f: OperatorFunction<T, Fleuve<U>>): OperatorFunction<T, Promise<U>> {
    return (source: T) => {
        const fl = f(source);
        return new Promise((resolve, reject) => {
            try {
                const fleuve$ = f(source);
                const subscription = fleuve$.subscribe((res) => {
                    resolve(res);
                    subscription.unsubscribe();
                });
            } catch (error) {
                reject(error);
            }
        });
    }
}