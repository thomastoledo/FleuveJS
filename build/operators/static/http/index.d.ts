export declare const http: {
    get: <T = any>(url: RequestInfo, { type, ...init }?: import("./http-types").HttpOptions) => import("../../../observable/promise-observable").PromiseObservable<string | Blob | T>;
    post: <T_1 = any>(url: RequestInfo, { type, ...init }?: import("./http-types").HttpOptions) => import("../../../observable/promise-observable").PromiseObservable<string | Blob | T_1>;
    put: <T_2 = any>(url: RequestInfo, { type, ...init }?: import("./http-types").HttpOptions) => import("../../../observable/promise-observable").PromiseObservable<string | Blob | T_2>;
    delete: <T_3 = any>(url: RequestInfo, { type, ...init }?: import("./http-types").HttpOptions) => import("../../../observable/promise-observable").PromiseObservable<string | Blob | T_3>;
};
