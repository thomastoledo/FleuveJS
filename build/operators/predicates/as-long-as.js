"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asLongAs = void 0;
var errors_1 = require("../../models/errors");
var filter_1 = require("./filter");
var asLongAs = function (f) {
    var stopped = false;
    return function (source) {
        if (stopped) {
            return Promise.reject(new errors_1.StopFleuveSignal());
        }
        return filter_1.filter(f)(source).catch(function (err) {
            stopped = true;
            throw err instanceof errors_1.FilterError ? new errors_1.StopFleuveSignal() : err;
        });
    };
};
exports.asLongAs = asLongAs;
