
import { UntilError } from "../../models/errors";
import { OperatorFunction } from "../../models/operator";

export const until = function<T = any>(f: OperatorFunction<T, boolean>): OperatorFunction<T, Promise<T>> {
    let stopped = false;
    return (source) => {
        return new Promise((resolve, reject) => {
            try {
                if (stopped || (stopped = f(source))) {
                    throw new UntilError();
                }
                resolve(source);
            } catch (error) {
                reject(error);
            }
        });
    }
}