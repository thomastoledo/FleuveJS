"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.until = void 0;
var errors_1 = require("../../models/errors");
var filter_1 = require("./filter");
var until = function (f) {
    var stopped = false;
    return function (source) {
        if (stopped) {
            return Promise.reject(new errors_1.StopFleuveSignal());
        }
        return filter_1.filter(f)(source)
            .then(function () {
            stopped = true;
            throw new errors_1.StopFleuveSignal();
        })
            .catch(function (err) {
            stopped = !(err instanceof errors_1.FilterError);
            if (stopped) {
                throw err;
            }
            return source;
        });
    };
};
exports.until = until;
