import { OperationResult, OperatorFunction } from "../../../models/operator";
import { Observable, ObservableFork } from "../../../observable";

export const fork = function <T = never>(
  obs: Observable<T>,
  ...operators: OperatorFunction<T, OperationResult<any>>[]
): ObservableFork<any> {
  const rest = new ObservableFork(obs, ...operators);
  return rest;
};
