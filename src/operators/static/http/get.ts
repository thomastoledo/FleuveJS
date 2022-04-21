
import { PromiseObservable } from "../../../observable/promise-observable";
  
export type GetResultOption = 'text' | 'json' | 'blob';

  export const get = function<T = any>(
    url: RequestInfo,
    type: GetResultOption = 'json',
    init?: RequestInit | undefined, 
  ): PromiseObservable<T | string | Blob>{
    return new PromiseObservable<T | string | Blob>(new Promise((resolve, reject) => {
      fetch(url, init)
      .then((res) => {
        if (type === 'json') {
          return resolve(res.json());
        }

        if (type === 'text') {
          return resolve(res.text());
        }

        if (type === 'blob') {
          return resolve(res.blob());
        }
      })
      .catch((err) => reject(err));
    }));
  };