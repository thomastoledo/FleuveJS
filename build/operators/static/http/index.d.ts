export declare namespace http {
    const get: <T = any>(url: RequestInfo, type?: import("./get").GetResultOption, init?: RequestInit | undefined) => import("../../../observable/promise-observable").PromiseObservable<string | Blob | T>;
    const post: <T = any>(url: RequestInfo, type?: import("./post").GetResultOption, init?: RequestInit | undefined) => import("../../../observable/promise-observable").PromiseObservable<string | Blob | T>;
}
