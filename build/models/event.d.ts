export interface Subscriber<T> {
    (value: T): void;
}
export declare class EventSubscription {
    private elem;
    private eventType;
    private listener;
    constructor(elem: Element, eventType: string, listener: EventListener);
    unsubscribe: () => void;
}
export interface NextCallback<T> {
    (source: T): T;
}
export interface Listener<T> {
    (source: T, event: Event): any;
}
