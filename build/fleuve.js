import { FilterError } from "./models/errors";
import { EventSubscription, } from "./models/event";
export class Fleuve {
    _innerSource;
    subscribers = [];
    _parent$;
    _forkOperations = [];
    _skipValue = false;
    constructor(_innerSource) {
        this._innerSource = _innerSource;
    }
    next(...events) {
        const onlyFunctions = events.every((event) => this.isFunction(event));
        const onlyScalar = events.every((event) => !this.isFunction(event));
        if (!onlyFunctions && !onlyScalar) {
            throw new Error("Please provide either only scalar values or only functions");
        }
        events.forEach((event) => {
            let res;
            if (this.isFunction(event)) {
                res = event(this._innerSource);
            }
            else {
                res = event;
            }
            try {
                this._innerSource = this._forkOperations.reduce((val, f) => f(val), res);
                this._skipValue = false;
                this.subscribers.forEach((f) => f(this._innerSource));
            }
            catch (err) {
                this._skipValue = err instanceof FilterError;
            }
        });
    }
    subscribe(subscriber) {
        if (!this.isFunction(subscriber)) {
            throw new Error("Please provide a function");
        }
        this.subscribers.push(subscriber);
        if (!this._skipValue) {
            subscriber(this._innerSource);
        }
    }
    pipe(...functions) {
        const fns = this.filterNonFunctions(...functions);
        const fleuve$ = new Fleuve();
        if (fns.length > 0) {
            try {
                const res = fns
                    .slice(1)
                    .reduce((val, fn) => fn(val), fns[0](this._innerSource));
                fleuve$.next(res);
            }
            catch (err) {
                fleuve$._skipValue = err instanceof FilterError;
            }
        }
        return fleuve$;
    }
    fork(...operators) {
        const fork$ = new Fleuve();
        fork$._parent$ = this;
        fork$._forkOperations = operators;
        this.subscribe((value) => { fork$.next(value); });
        return fork$;
    }
    addEventListener(selector, eventType, listener, options) {
        const elem = document.querySelector(selector);
        if (!elem) {
            throw new Error(`Could not find any element with selector "${selector}"`);
        }
        const eventListener = (event) => listener(this._innerSource, event);
        elem.addEventListener(eventType, eventListener, options);
        return new EventSubscription(elem, eventType, eventListener);
    }
    filterNonFunctions(...fns) {
        return fns.filter((f) => this.isFunction(f));
    }
    isFunction(fn) {
        return typeof fn === "function";
    }
}
