"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventSubscription = exports.Fleuve = void 0;

class Fleuve {
  constructor(source) {
    var _innerSource = source;
    var subscribers = [];

    this.next = function () {
      for (var _len = arguments.length, events = new Array(_len), _key = 0; _key < _len; _key++) {
        events[_key] = arguments[_key];
      }

      var onlyFunctions = events.every(event => isFunction(event));
      var onlyScalar = events.every(event => !isFunction(event));

      if (!onlyFunctions && !onlyScalar) {
        throw new Error('Please provide either only scalar values or only functions');
      }

      events.forEach(event => {
        if (isFunction(event)) {
          _innerSource = event(_innerSource);
        } else {
          _innerSource = event;
        }

        subscribers.forEach(f => f(_innerSource));
      });
    };

    this.subscribe = f => {
      if (!isFunction(f)) {
        throw new Error('Please provide a function');
      }

      subscribers.push(f);
      f(_innerSource);
    };

    this.pipe = function () {
      var fns = filterNonFunctions(...arguments);
      var obs = new Observable();

      if (fns.length > 0) {
        var res = fns.slice(1).reduce((val, fn) => fn(val), fns[0](_innerSource));
        obs.next(res);
      }

      return obs;
    };

    this.addEventListener = (selector, eventType, listener, options) => {
      var elem = document.querySelector(selector);

      var eventListener = event => {
        listener(_innerSource, event);
      };

      elem === null || elem === void 0 ? void 0 : elem.addEventListener(eventType, eventListener, options);
      return new EventSubscription(elem, eventType, eventListener);
    };

    var filterNonFunctions = function filterNonFunctions() {
      for (var _len2 = arguments.length, fns = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        fns[_key2] = arguments[_key2];
      }

      return fns.filter(f => isFunction(f));
    };

    var isFunction = fn => typeof fn === 'function';
  }

}

exports.Fleuve = Fleuve;

class EventSubscription {
  constructor(elem, eventType, listener) {
    this.unsubscribe = () => {
      elem === null || elem === void 0 ? void 0 : elem.removeEventListener(eventType, listener);
    };
  }

}

exports.EventSubscription = EventSubscription;