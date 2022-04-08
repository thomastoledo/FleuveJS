import { MutableObservable } from "../../../observable/mutable-observable";
/**
 * @deprecated WILL BE REMOVED IN VERSION 1.2.4
 * @param element
 * @param eventName
 * @returns
 */
export var onEvent = function (element, eventName) {
    var obs$ = new MutableObservable();
    element.addEventListener(eventName, function (e) { return obs$.next(e); });
    return obs$;
};
