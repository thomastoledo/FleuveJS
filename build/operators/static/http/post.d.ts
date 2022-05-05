import { PromiseObservable } from "../../../observable/promise-observable";
import { HttpOptions } from "./http-types";
export declare type GetResultOption = "text" | "json" | "blob";
export declare const post: <T = any>(url: RequestInfo, { type, ...init }?: HttpOptions) => PromiseObservable<string | Blob | T>;
