import { Observable } from "../../../observable/observable";
export var of = function (value) {
    var obs$ = new Observable(value);
    obs$.close();
    return obs$;
};
