import { PromiseObservable } from "../../../observable/promise-observable";
export interface HttpGetOptions {
    type: 'text' | 'json' | 'blob';
    queryParams: {
        [k: string]: any;
    };
}
export declare const get: <T = any>(url: string, options?: HttpGetOptions) => PromiseObservable<string | Blob | T>;
