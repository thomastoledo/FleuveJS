import { EventSubscription, } from "./models/event";
export class Fleuve {
    _innerSource;
    subscribers = [];
    _parent$;
    _preProcessOperations = [];
    _isError = false;
    constructor(_innerSource) {
        this._innerSource = _innerSource;
    }
    next(...events) {
        this._isOnlyFunctionsOrOnlyScalars(events);
        events.forEach((event) => {
            try {
                this._innerSource = this._preProcessOperations.reduce((val, f) => f(val), this._nextEvent(event));
                this._isError = false;
                this.subscribers.forEach((f) => f(this._innerSource));
            }
            catch {
                this._isError = true;
            }
        });
    }
    subscribe(subscriber) {
        if (!this._isFunction(subscriber)) {
            throw new Error("Please provide a function");
        }
        this.subscribers.push(subscriber);
        if (!this._isError) {
            subscriber(this._innerSource);
        }
    }
    pipe(...operations) {
        const fleuve$ = new Fleuve();
        try {
            const value = this._computeValue(...this._filterNonFunctions(...operations));
            fleuve$.next(value);
        }
        catch {
            fleuve$._isError = true;
        }
        return fleuve$;
    }
    fork(...operators) {
        const fork$ = new Fleuve();
        fork$._parent$ = this;
        fork$._preProcessOperations = operators;
        this.subscribe((value) => {
            fork$.next(value);
        });
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
    _filterNonFunctions(...fns) {
        return fns.filter((f) => this._isFunction(f));
    }
    _isFunction(fn) {
        return typeof fn === "function";
    }
    _isOnlyFunctionsOrOnlyScalars(events) {
        const onlyFunctions = events.every((event) => this._isFunction(event));
        const onlyScalar = events.every((event) => !this._isFunction(event));
        if (!onlyFunctions && !onlyScalar) {
            throw new Error("Please provide either only scalar values or only functions");
        }
    }
    _nextEvent(event) {
        let res;
        if (this._isFunction(event)) {
            res = event(this._innerSource);
        }
        else {
            res = event;
        }
        return res;
    }
    _computeValue(...operations) {
        if (operations.length > 0) {
            return operations
                .slice(1)
                .reduce((val, fn) => fn(val), operations[0](this._innerSource));
        }
    }
}
