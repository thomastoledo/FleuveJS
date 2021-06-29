export class EventSubscription {
    elem;
    eventType;
    listener;
    constructor(elem, eventType, listener) {
        this.elem = elem;
        this.eventType = eventType;
        this.listener = listener;
    }
    unsubscribe = () => {
        this.elem?.removeEventListener(this.eventType, this.listener);
    };
}
