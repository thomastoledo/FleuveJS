import { PromiseObservable } from "../../../observable/promise-observable";
export declare type GetResultOption = 'text' | 'json' | 'blob';
export declare const get: <T = any>(url: RequestInfo | URL, init?: RequestInit | undefined, type?: GetResultOption) => PromiseObservable<string | Blob | T>;
