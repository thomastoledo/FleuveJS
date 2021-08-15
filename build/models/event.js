var EventSubscription = /** @class */ (function () {
    function EventSubscription(elem, eventType, listener) {
        var _this = this;
        this.elem = elem;
        this.eventType = eventType;
        this.listener = listener;
        this.unsubscribe = function () {
            _this.elem.removeEventListener(_this.eventType, _this.listener);
        };
    }
    return EventSubscription;
}());
export { EventSubscription };
