import { PromiseObservable } from "../../../observable/promise-observable";
export declare type GetResultOption = 'text' | 'json' | 'blob';
export declare const post: <T = any>(url: RequestInfo, type?: GetResultOption, init?: RequestInit | undefined) => PromiseObservable<string | Blob | T>;
