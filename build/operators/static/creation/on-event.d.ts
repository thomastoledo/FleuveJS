import { MutableObservable } from "../../../observable/mutable-observable";
export declare const onEvent: (element: HTMLElement, eventName: keyof HTMLElementEventMap) => MutableObservable<Event>;
