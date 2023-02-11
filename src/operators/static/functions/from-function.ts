import { OnNext, OperationResult, OperationResultFlag, Subscriber, Subscription, Types } from "../../../models";
import { Observable } from "../../../observable/observable";

export interface ProxyObservableFunction<T = never> extends Types.Observable<T> {
  (...args: any): any;
  asObservable: () => ProxyObservable<T>;
}

class ProxyObservable<T = never> extends Observable<T> implements Types.Observable<T> {
  private proxy: {(...args: any): T};

  private constructor(f: (...args: any) => T) {
      super();
      this.proxy = Object.assign(new Proxy(f, {
          apply: (target, thisArg, args) => {
              let res;
              let operationResult: OperationResult<T>;
              try {
                  operationResult = new OperationResult(res = target.apply(thisArg, args));
              } catch(e) {
                  operationResult = new OperationResult(res as any, OperationResultFlag.OperationError, e as Error);
              }

              this.innerSequence = [operationResult];
              this._subscribers.forEach((s) => this.executeSubscriber(this.innerSequence, s));

              if (operationResult.isOperationError()) {
                  throw operationResult.error;
              }
              
              return res;
          },
      }));
  }

  public static create<T>(f: (...args: any) => T): ProxyObservableFunction<T> {
      const instance = new ProxyObservable<T>(f);
      const res: ProxyObservableFunction<T> = (...args: any[]) => instance.proxy(...args);

      instance.innerSequence = [];
      res.subscribe = function(subscriber?: OnNext<T> | Subscriber<T> | undefined): Subscription {
        return instance.subscribe.apply(instance, [subscriber ?? void 0]);
      }
      res.pipe = instance.pipe.bind(instance);
      res.asObservable = () => instance;
      return res;
  }
}
  
  export const fromFunction = function <T = any>(
    f: (...args: any) => T
  ): ProxyObservableFunction<T> {
    return ProxyObservable.create(f);
  };