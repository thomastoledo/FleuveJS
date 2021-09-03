export class EventSubscription {
  constructor(
    private elem: Element,
    private eventType: keyof HTMLElementEventMap,
    private listener: EventListener
  ) {}
  unsubscribe = () => {
    this.elem.removeEventListener(this.eventType, this.listener);
  };
}

export interface Listener<T = never> {
  (source: T, event: Event): any;
}
