"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.switchMap = void 0;
function switchMap(f) {
    return function (source) {
        var fl = f(source);
        return new Promise(function (resolve, reject) {
            try {
                var fleuve$ = f(source);
                var subscription_1 = fleuve$.subscribe(function (res) {
                    resolve(res);
                    subscription_1.unsubscribe();
                });
            }
            catch (error) {
                reject(error);
            }
        });
    };
}
exports.switchMap = switchMap;
