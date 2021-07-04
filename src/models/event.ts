export interface Subscriber<T = any> {
  (value: T): void;
}

export class EventSubscription {
  constructor(
    private elem: Element,
    private eventType: string,
    private listener: EventListener
  ) {}
  unsubscribe = () => {
    this.elem?.removeEventListener(this.eventType, this.listener);
  };
}

export interface Listener<T> {
  (source: T, event: Event): any;
}
