import { MutableObservable } from "../../../observable";
export declare const onEvent: (element: HTMLElement, eventName: keyof HTMLElementEventMap) => MutableObservable<Event>;
