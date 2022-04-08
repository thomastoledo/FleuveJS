
import { PromiseObservable } from "../../../observable";
import { of } from "../creation";
  
  export const get = function <T = never>(
    url: string
  ): PromiseObservable<T>{
    return new PromiseObservable<T>(new Promise((resolve, reject) => {
      fetch(url).then((res) => resolve(res))
    }));
  };