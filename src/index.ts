export class Fleuve {
  private readonly subscribers: Function[] = [];
  constructor(private _innerSource?: any) {}

  next = (...events) => {
    const onlyFunctions = events.every(event => this.isFunction(event));
    const onlyScalar = events.every(event => !this.isFunction(event));
    if (!onlyFunctions && !onlyScalar) {
      throw new Error('Please provide either only scalar values or only functions');
    }
    events.forEach(event => {
      if (this.isFunction(event)) {
        this._innerSource = event(this._innerSource);
      } else {
        this._innerSource = event;
      }
      this.subscribers.forEach((f) => f(this._innerSource));
    })
  };

  subscribe = (f) => {
    if (!this.isFunction(f)) {
      throw new Error('Please provide a function');
    }
    this. subscribers.push(f);
    f(this._innerSource);
  };

  pipe = (...functions: Function[]) => {
    const fns = this.filterNonFunctions(...functions);
    const fleuve$ = new Fleuve();
    if (fns.length > 0) {
      const res = fns.slice(1).reduce((val, fn) => fn(val), fns[0](this._innerSource));
      fleuve$.next(res);
    }
    return fleuve$;
  };

  addEventListener = (selector: string, eventType: string, listener: FleuveEventListener, options: AddEventListenerOptions) => {
    const elem = document.querySelector(selector);

    const eventListener: EventListener = (event: Event) => listener(this._innerSource, event);

    elem?.addEventListener(eventType, eventListener, options);

    return new EventSubscription(elem, eventType, eventListener);
  }

  
  private filterNonFunctions = (...fns: any[]) => fns.filter((f) => this.isFunction(f));

  private isFunction = (fn: any) => typeof fn === 'function';
}


export class EventSubscription {
  constructor(private elem: Element, private eventType: string, private listener: EventListener) {
  }
 unsubscribe = () => {
    this.elem?.removeEventListener(this.eventType, this.listener);
  };
}

export interface FleuveEventListener extends EventListener {
  (source: any, event: Event): any;
}