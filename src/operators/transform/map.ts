import { OperatorFunction } from "../../models/operator";

export const map = function<T = any, U = T>(f: OperatorFunction<T, U>): OperatorFunction<T, Promise<U>> {
    return (source) => {
        return new Promise<U>((resolve, reject) => {
            try {
                resolve(f(source));
            } catch (error) {
                reject(error);
            }
        });
    }
}