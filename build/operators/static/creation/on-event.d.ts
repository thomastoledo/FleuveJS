import { MutableObservable } from "../../../observable/mutable-observable";
/**
 * @deprecated WILL BE REMOVED IN VERSION 1.2.4
 * @param element
 * @param eventName
 * @returns
 */
export declare const onEvent: (element: HTMLElement, eventName: keyof HTMLElementEventMap) => MutableObservable<Event>;
