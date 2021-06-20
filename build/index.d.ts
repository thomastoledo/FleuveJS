export declare class Fleuve {
    private _innerSource?;
    private readonly subscribers;
    constructor(_innerSource?: any);
    next: (...events: any[]) => void;
    subscribe: (f: any) => void;
    pipe: (...functions: Function[]) => Fleuve;
    addEventListener: (selector: string, eventType: string, listener: FleuveEventListener, options: AddEventListenerOptions) => EventSubscription;
    private filterNonFunctions;
    private isFunction;
}
export declare class EventSubscription {
    private elem;
    private eventType;
    private listener;
    constructor(elem: Element, eventType: string, listener: EventListener);
    unsubscribe: () => void;
}
export interface FleuveEventListener extends EventListener {
    (source: any, event: Event): any;
}
