import { FilterError } from "../models/errors";
export const filter = function (f) {
    return (source) => {
        if (f(source)) {
            return source;
        }
        throw new FilterError();
    };
};
