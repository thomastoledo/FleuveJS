export class Fleuve {
    constructor(_innerSource) {
        this._innerSource = _innerSource;
        this.subscribers = [];
        this.next = (...events) => {
            const onlyFunctions = events.every(event => this.isFunction(event));
            const onlyScalar = events.every(event => !this.isFunction(event));
            if (!onlyFunctions && !onlyScalar) {
                throw new Error('Please provide either only scalar values or only functions');
            }
            events.forEach(event => {
                if (this.isFunction(event)) {
                    this._innerSource = event(this._innerSource);
                }
                else {
                    this._innerSource = event;
                }
                this.subscribers.forEach((f) => f(this._innerSource));
            });
        };
        this.subscribe = (f) => {
            if (!this.isFunction(f)) {
                throw new Error('Please provide a function');
            }
            this.subscribers.push(f);
            f(this._innerSource);
        };
        this.pipe = (...functions) => {
            const fns = this.filterNonFunctions(...functions);
            const fleuve$ = new Fleuve();
            if (fns.length > 0) {
                const res = fns.slice(1).reduce((val, fn) => fn(val), fns[0](this._innerSource));
                fleuve$.next(res);
            }
            return fleuve$;
        };
        this.addEventListener = (selector, eventType, listener, options) => {
            const elem = document.querySelector(selector);
            const eventListener = (event) => listener(this._innerSource, event);
            elem === null || elem === void 0 ? void 0 : elem.addEventListener(eventType, eventListener, options);
            return new EventSubscription(elem, eventType, eventListener);
        };
        this.filterNonFunctions = (...fns) => fns.filter((f) => this.isFunction(f));
        this.isFunction = (fn) => typeof fn === 'function';
    }
}
export class EventSubscription {
    constructor(elem, eventType, listener) {
        this.elem = elem;
        this.eventType = eventType;
        this.listener = listener;
        this.unsubscribe = () => {
            var _a;
            (_a = this.elem) === null || _a === void 0 ? void 0 : _a.removeEventListener(this.eventType, this.listener);
        };
    }
}
