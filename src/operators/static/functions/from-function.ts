import { OperationResult, OperationResultFlag, OperatorFunction, SubscribeFunction, Types } from "../../../models";
import { Observable } from "../../../observable/observable";

class ProxyObservable<T = never> extends Observable<T> {
  private proxy: {(...args: any): T};

  private constructor(f: (...args: any) => T) {
      super();
      this.proxy = Object.assign(new Proxy(f, {
          apply: (target, thisArg, args) => {
              let res;
              let operationResult: OperationResult<T>;

              try {
                  operationResult = new OperationResult(target.apply(thisArg, args));
              } catch(e) {
                  operationResult = new OperationResult(res as any, OperationResultFlag.OperationError, e as Error);
              }

              this._innerSequence = [operationResult];
              this._subscribers.forEach((s) => this.executeSubscriber(s, this._innerSequence));

              if (operationResult.isOperationError()) {
                  throw operationResult.error;
              }
              
              return res;
          },
      }));
  }

  public static create<T>(f: (...args: any) => T): Types.ProxyObservable<T> {
      const instance = new ProxyObservable(f);
      const res = (...args: any[]) => instance.proxy(...args);
      res.subscribe = instance.subscribe.bind(instance);
      res.pipe = instance.pipe.bind(instance);
      return res;
  }
}
  
  export const fromFunction = function <T = any>(
    f: (...args: any) => T
  ): Types.ProxyObservable<T> {
    return ProxyObservable.create(f);
  };