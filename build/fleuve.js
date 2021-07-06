import { FilterError } from "./models/errors";
import { EventSubscription } from "./models/event";
export class Fleuve {
    _innerValue;
    _subscribers = [];
    _preProcessOperations = [];
    _isStarted = false;
    _isComplete = false;
    _forks$ = [];
    constructor(_innerValue) {
        this._innerValue = _innerValue;
        this._isStarted = arguments.length > 0;
    }
    addEventListener(selector, eventType, listener, options) {
        const elem = document.querySelector(selector);
        if (!elem) {
            throw new Error(`Could not find any element with selector "${selector}"`);
        }
        const eventListener = this._createEventListenerFromListener(listener);
        elem.addEventListener(eventType, eventListener, options);
        return new EventSubscription(elem, eventType, eventListener);
    }
    dam() {
        // TODO - TTO: rajouter un onError et un onComplete sur les subscribers pour pouvoir tous les exécuter
        this._forks$.forEach((fork$) => {
            fork$.dam();
            fork$._complete();
        });
    }
    fork(...operators) {
        const fork$ = new Fleuve();
        fork$._preProcessOperations = operators;
        this.subscribe((value) => {
            try {
                const nextValue = fork$._computeValue(value, ...fork$._preProcessOperations);
                fork$.next(nextValue);
            }
            catch (err) {
                if (!(err instanceof FilterError)) {
                    throw err;
                }
            }
        });
        this._forks$.push(fork$);
        return fork$;
    }
    next(...events) {
        if (!this._isComplete) {
            if (!this._isStarted) {
                this._isStarted = arguments.length > 0;
            }
            if (this._isStarted) {
                events.forEach((event) => {
                    this._innerValue = event;
                    this._callSubscribers(event);
                });
            }
        }
        return this;
    }
    pile(...operations) {
        try {
            const value = this._computeValue(this._innerValue, ...this._filterNonFunctions(...operations));
            this.next(value);
        }
        catch (err) {
            if (!(err instanceof FilterError)) {
                throw err;
            }
        }
        return this;
    }
    pipe(...operations) {
        const fleuve$ = new Fleuve();
        if (this._isStarted) {
            try {
                const value = this._computeValue(this._innerValue, ...this._filterNonFunctions(...operations));
                fleuve$.next(value);
            }
            catch (err) {
                if (!(err instanceof FilterError)) {
                    throw err;
                }
            }
        }
        return fleuve$;
    }
    subscribe(subscriber) {
        if (!this._isFunction(subscriber)) {
            throw new Error("Please provide a function");
        }
        this._subscribers.push(subscriber);
        if (this._isStarted) {
            subscriber(this._innerValue);
        }
    }
    _filterNonFunctions(...fns) {
        return fns.filter((f) => this._isFunction(f));
    }
    _isFunction(fn) {
        return typeof fn === "function";
    }
    _callSubscribers(event) {
        this._subscribers.forEach((s) => s(event));
    }
    _computeValue(initValue, ...operations) {
        if (operations.length > 0) {
            return operations
                .slice(1)
                .reduce((val, fn) => fn(val), operations[0](initValue));
        }
        else {
            return initValue;
        }
    }
    _createEventListenerFromListener(listener) {
        return (event) => listener(this._innerValue, event);
    }
    _complete() {
        this._isComplete = true;
    }
}
