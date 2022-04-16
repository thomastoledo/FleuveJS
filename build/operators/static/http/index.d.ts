export declare namespace http {
    const get: <T = any>(url: string, options?: import("./get").HttpGetOptions) => import("../../../observable/promise-observable").PromiseObservable<string | Blob | T>;
}
