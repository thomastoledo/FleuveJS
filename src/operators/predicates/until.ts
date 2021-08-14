import { FilterError, StopFleuveSignal } from "../../models/errors";
import { OperatorFunction } from "../../models/operator";
import { filter } from "./filter";

export const until = function <T = any>(
  f: OperatorFunction<T, boolean>
): OperatorFunction<T, Promise<T>> {
  let stopped = false;
  return (source: T) => {
    if (stopped) {
      return Promise.reject(new StopFleuveSignal());
    }
    return filter(f)(source)
      .then(() => {
        stopped = true;
        throw new StopFleuveSignal();
      })
      .catch((err: Error | FilterError) => {
        stopped = !(err instanceof FilterError);
        if (stopped) {
          throw err;
        }
        return source;
      });
  };
};