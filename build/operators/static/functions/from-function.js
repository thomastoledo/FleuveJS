import { ProxyObservable } from "../../../observable/proxy-observable";
export var fromFunction = function (f) {
    return ProxyObservable.create(f);
};
