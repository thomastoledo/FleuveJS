import { OperationResult, OperationResultFlag } from "../../models/operator";
import { of } from "../static/creation/of";
import { nth } from "./nth";

describe('nth', () => {
    it('should return a function that will only process the nth event', () => {
        const nthOperator = nth(3);
        expect(nthOperator(12)).toEqual(new OperationResult(12, OperationResultFlag.FilterNotMatched));
        expect(nthOperator(13)).toEqual(new OperationResult(13, OperationResultFlag.FilterNotMatched));
        expect(nthOperator(14)).toEqual(new OperationResult(14));
        expect(nthOperator(15)).toEqual(new OperationResult(15, OperationResultFlag.MustStop));
    });

    it('should only process the nth event of an Observable', () => {
        const obs$ = of(1, 2, 3, 4, 5);
        const nth$ = obs$.pipe(nth(3));
        nth$.subscribe((x) => expect(x).toEqual(3));
    });
  });
