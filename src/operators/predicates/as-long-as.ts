import { FilterError, StopFleuveSignal } from "../../models/errors";
import { OperatorFunction } from "../../models/operator";
import { filter } from "./filter";

export const asLongAs = function <T = any>(
  f: OperatorFunction<T, boolean>
): OperatorFunction<T, Promise<T>> {
  let stopped = false;
  return (source: T) => {
    if (stopped) {
      return Promise.reject(new StopFleuveSignal());
    }
    return filter(f)(source).catch((err: Error | FilterError) => {
      stopped = true;
      throw err instanceof FilterError ? new StopFleuveSignal() : err;
    });
  };
};
