import { MutableObservable } from "../../../observable";
export var onEvent = function (element, eventName) {
    var obs$ = new MutableObservable();
    element.addEventListener(eventName, function (e) { return obs$.next(e); });
    return obs$;
};