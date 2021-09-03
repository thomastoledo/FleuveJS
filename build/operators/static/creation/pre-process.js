import { Fleuve } from "../../../fleuve/fleuve";
export function preProcess() {
    var _a;
    var operations = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        operations[_i] = arguments[_i];
    }
    var fleuve$ = new Fleuve();
    (_a = fleuve$._preProcessOperations).push.apply(_a, operations);
    return fleuve$;
}
