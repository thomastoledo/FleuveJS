import { Observable } from "../../../observable/observable";
export function preProcess() {
    var _a;
    var operations = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        operations[_i] = arguments[_i];
    }
    var obs$ = new Observable();
    (_a = obs$._preProcessOperations).push.apply(_a, operations);
    return obs$;
}
