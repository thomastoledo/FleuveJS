import { Fleuve } from "../../../fleuve/fleuve";
export var of = function (value) {
    var fleuve$ = new Fleuve(value);
    fleuve$.close();
    fleuve$._isFinite = true;
    return fleuve$;
};
