export declare class EventSubscription {
    private elem;
    private eventType;
    private listener;
    constructor(elem: Element, eventType: keyof HTMLElementEventMap, listener: EventListener);
    unsubscribe: () => void;
}
export interface Listener<T = never> {
    (source: T, event: Event): any;
}
