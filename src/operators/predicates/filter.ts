
import { FilterError } from "../../models/errors";
import { OperatorFunction } from "../../models/operator";

export const filter = function<T = any>(f: OperatorFunction<T, boolean>): OperatorFunction<T, Promise<T>> {
    return (source) => {
        return new Promise((resolve, reject) => {
            try {
                if (!f(source)) {
                    throw new FilterError();
                }
                resolve(source);
            } catch (error) {
                reject(error);
            }
        });
    }
}