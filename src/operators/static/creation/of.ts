import { Fleuve } from "../../../fleuve/fleuve";

export const of = function<T>(value: T): Fleuve<T> {
    const fleuve$ = new Fleuve(value);
    fleuve$.close();
    (fleuve$ as any)._isFinite = true;
    return fleuve$;
}