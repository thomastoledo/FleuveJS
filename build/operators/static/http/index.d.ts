export declare namespace http {
    const get: <T = any>(url: RequestInfo, { type, ...init }?: import("./http-types").HttpOptions) => import("../../../observable/promise-observable").PromiseObservable<string | Blob | T>;
    const post: <T = any>(url: RequestInfo, { type, ...init }?: import("./http-types").HttpOptions) => import("../../../observable/promise-observable").PromiseObservable<string | Blob | T>;
}
