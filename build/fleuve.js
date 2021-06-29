import { EventSubscription } from "./models/event";
export class Fleuve {
    _innerSource;
    subscribers = [];
    constructor(_innerSource) {
        this._innerSource = _innerSource;
    }
    next = (...events) => {
        const onlyFunctions = events.every((event) => this.isFunction(event));
        const onlyScalar = events.every((event) => !this.isFunction(event));
        if (!onlyFunctions && !onlyScalar) {
            throw new Error("Please provide either only scalar values or only functions");
        }
        events.forEach((event) => {
            if (this.isFunction(event)) {
                this._innerSource = event(this._innerSource);
            }
            else {
                this._innerSource = event;
            }
            this.subscribers.forEach((f) => f(this._innerSource));
        });
    };
    subscribe = (subscriber) => {
        if (!this.isFunction(subscriber)) {
            throw new Error("Please provide a function");
        }
        this.subscribers.push(subscriber);
        subscriber(this._innerSource);
    };
    pipe = (...functions) => {
        const fns = this.filterNonFunctions(...functions);
        const fleuve$ = new Fleuve();
        if (fns.length > 0) {
            try {
                const res = fns
                    .slice(1)
                    .reduce((val, fn) => fn(val), fns[0](this._innerSource));
                fleuve$.next(res);
            }
            catch { }
        }
        return fleuve$;
    };
    addEventListener = (selector, eventType, listener, options) => {
        const elem = document.querySelector(selector);
        if (!elem) {
            throw new Error(`Could not find any element with selector "${selector}"`);
        }
        const eventListener = (event) => listener(this._innerSource, event);
        elem.addEventListener(eventType, eventListener, options);
        return new EventSubscription(elem, eventType, eventListener);
    };
    filterNonFunctions = (...fns) => fns.filter((f) => this.isFunction(f));
    isFunction = (fn) => typeof fn === "function";
}
