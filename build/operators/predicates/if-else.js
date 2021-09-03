import { OperationResult, OperationResultFlag, } from "../../models/operator";
import { of } from "../static/creation/of";
import { filter } from "./filter";
export var ifElse = function (predicate, ifs, elses) {
    return function (source) {
        var _a, _b;
        var operationResult = filter(predicate)(source);
        return new OperationResult(!operationResult.isFilterNotMatched()
            ? (_a = of(source)).pipe.apply(_a, ifs) : (_b = of(source)).pipe.apply(_b, (elses !== null && elses !== void 0 ? elses : [])), OperationResultFlag.UnwrapSwitch);
    };
};
