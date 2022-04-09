
import { PromiseObservable } from "../../../observable/promise-observable";
  
  export const get = function <T = never>(
    url: string
  ): PromiseObservable<T>{
    return new PromiseObservable<T>(new Promise((resolve, reject) => {
      fetch(url).then((res) => {console.log(res); return res;}).then((res) => resolve(res.json())).catch((err) => reject(err));
    }));
  };