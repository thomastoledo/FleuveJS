import { Types } from "../../../models/types";
import { ProxyObservable } from "../../../observable/proxy-observable";

export interface ProxyObservableFunction<T = never>
  extends Types.Observable<T> {
  (...args: any): any;
  asObservable: () => ProxyObservable<T>;
}

export const fromFunction = function <T = any>(
  f: (...args: any) => T
): ProxyObservableFunction<T> {
  return ProxyObservable.create(f);
};
