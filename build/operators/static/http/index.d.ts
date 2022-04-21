export declare namespace http {
    const get: <T = any>(url: RequestInfo | URL, init?: RequestInit | undefined, type?: import("./get").GetResultOption) => import("../../../observable/promise-observable").PromiseObservable<string | Blob | T>;
}
