"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Observable = void 0;

class Observable {
  constructor() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var values = args;
    var subscribers = [];

    this.next = function () {
      for (var _len2 = arguments.length, vals = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        vals[_key2] = arguments[_key2];
      }

      values = vals;
      subscribers.forEach(f => f(...values));
    };

    this.subscribe = f => {
      subscribers.push(f);
      f(...values);
    };

    this.pipe = function () {
      var fns = filterNonFunctions(...arguments);
      var obs = new Observable();

      if (fns.length > 0) {
        var res = fns.slice(1).reduce((val, fn) => fn(val), fns[0](...values));
        obs.next(res);
      }

      return obs;
    };

    var filterNonFunctions = function filterNonFunctions() {
      for (var _len3 = arguments.length, fns = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        fns[_key3] = arguments[_key3];
      }

      return fns.filter(f => typeof f === 'function');
    };
  }

}

exports.Observable = Observable;