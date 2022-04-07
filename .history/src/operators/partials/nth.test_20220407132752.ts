import { fail } from "../../helpers/function.helper";
import { OperationResult, OperationResultFlag } from "../../models/operator";
import { subscriberOf } from "../../models/subscription";
import { fork, mutable, preProcess } from "../static/creation";
import { of } from "../static/creation/of";
import { nth } from "./nth";

describe("nth", () => {
  it("should return a function that will only process the nth event", () => {
    const nthOperator = nth(3);
    expect(nthOperator(12)).toEqual(
      new OperationResult(12, OperationResultFlag.FilterNotMatched)
    );
    expect(nthOperator(13)).toEqual(
      new OperationResult(13, OperationResultFlag.FilterNotMatched)
    );
    expect(nthOperator(14)).toEqual(new OperationResult(14));
    expect(nthOperator(15)).toEqual(
      new OperationResult(15, OperationResultFlag.MustStop)
    );
  });

  it("should only process the nth event of an Observable", () => {
    const obs$ = of(1, 2, 3, 4, 5);
    const nth$ = obs$.pipe(nth(3));
    nth$.subscribe((x) => expect(x).toEqual(3));
  });

  it("should process zero events of an Observable", () => {
    const obs$ = of(1, 2, 3, 4, 5);
    const take$ = obs$.pipe(nth(6));
    const completeCb = jest.fn();
    take$.subscribe(
      subscriberOf(
        () => fail('Zero event should have been handled'),
        void 0,
        completeCb
      )
    );
    expect(completeCb).toHaveBeenCalledTimes(1);
  });

  it("should process zero events of a MutableObservable", () => {
    const mut$ = mutable(1, 2, 3, 4, 5);
    const take$ = mut$.pipe(nth(10));
    const completeCb = jest.fn();
    take$.subscribe(
        subscriberOf(
          () => fail('Zero event should have been handled'),
          void 0,
          completeCb
        )
      );
      expect(completeCb).toHaveBeenCalledTimes(1);
  });

  it("should process the nth element of a MutableObservable", () => {
    const events = [10, 11, 12, 13, 14, 15];
    const mut$ = preProcess<number>(nth(5));
    const completeCb = jest.fn();
    mut$.subscribe(
      subscriberOf((x) => expect(x).toEqual(14), void 0, completeCb)
    );
    mut$.next(...events);
    expect(completeCb).toHaveBeenCalledTimes(0);
  });

  it("should compile only the second value", () => {
    const mut$ = mutable(10, 20, 30);
    const completeCb = jest.fn();

    mut$.subscribe((x) => expect([10, 20, 30].includes(x)).toEqual(true));
    mut$.compile(nth(2), map((x) => x * 2));
    mut$.subscribe(subscriberOf((x) => expect(x).toEqual(40), void 0, completeCb));
    expect(completeCb).toHaveBeenCalledTimes(0);
  });

  it("should admit only the third value for the fork", () => {
    const mut$ = mutable<number>();
    const fork$ = fork(mut$, nth(3));
    const completeCb = jest.fn();
    fork$.subscribe(subscriberOf((x) => expect(x).toEqual(30), void 0, completeCb));
    mut$.next(10, 20, 30, 40);
    expect(completeCb).toHaveBeenCalledTimes(1);
  });
});
