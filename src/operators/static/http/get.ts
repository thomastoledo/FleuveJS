
import { PromiseObservable } from "../../../observable/promise-observable";
  
export interface HttpGetOptions {
  type: 'text' | 'json' | 'blob';
  queryParams: {[k: string]: any}
}

  export const get = function<T = any>(
    url: string, 
    options: HttpGetOptions = {
      queryParams: {},
      type: 'json'
    }
  ): PromiseObservable<T | string | Blob>{
    return new PromiseObservable<T | string | Blob>(new Promise((resolve, reject) => {
      fetch(url)
      .then((res) => {
        if (options.type === 'json') {
          return resolve(res.json());
        }

        if (options.type === 'text') {
          return resolve(res.text());
        }

        if (options.type === 'blob') {
          return resolve(res.blob());
        }
      })
      .catch((err) => reject(err));
    }));
  };