// import { MutableObservable } from "../../../observable/mutable-observable";

// export const onEvent = (element: HTMLElement, eventName: keyof HTMLElementEventMap) => {
//     const obs$ = new MutableObservable<Event>();
//     element.addEventListener(eventName, (e: Event) => obs$.next(e));
//     return obs$;
// }