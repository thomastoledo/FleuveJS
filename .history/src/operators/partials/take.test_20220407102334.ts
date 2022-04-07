import { OperationResult, OperationResultFlag } from "../../models/operator";
import { subscriberOf } from "../../models/subscription";
import { of, mutable, preProcess, fork } from "../static/creation/";
import { take } from "./take";
describe("take", () => {
  it("should return a function that will only process the take event", () => {
    const takeOperator = take(3);
    expect(takeOperator(12)).toEqual(new OperationResult(12));
    expect(takeOperator(13)).toEqual(new OperationResult(13));
    expect(takeOperator(14)).toEqual(new OperationResult(14));
    expect(takeOperator(15)).toEqual(
      new OperationResult(15, OperationResultFlag.MustStop)
    );
  });

  it("should only process n events of an Observable", () => {
    const obs$ = of(1, 2, 3, 4, 5);
    const take$ = obs$.pipe(take(3));
    const completeCb = jest.fn();
    take$.subscribe(
      subscriberOf(
        (x) => expect([1, 2, 3].includes(x)).toEqual(true),
        void 0,
        completeCb
      )
    );
    expect(completeCb).toHaveBeenCalledTimes(1);
  });

  it("should process all events of an Observable", () => {
    const obs$ = of(1, 2, 3, 4, 5);
    const take$ = obs$.pipe(take(100));
    const completeCb = jest.fn();
    take$.subscribe(
      subscriberOf(
        (x) => expect([1, 2, 3, 4, 5].includes(x)).toEqual(true),
        void 0,
        completeCb
      )
    );
    expect(completeCb).toHaveBeenCalledTimes(1);
  });

  it("should process all events of a MutableObservable", () => {
    const mut$ = mutable(1, 2, 3, 4, 5);
    const take$ = mut$.pipe(take(10));
    const completeCb = jest.fn();
    take$.subscribe(
      subscriberOf(
        (x) => expect([1, 2, 3, 4, 5].includes(x)).toEqual(true),
        void 0,
        completeCb
      )
    );
    expect(completeCb).toHaveBeenCalledTimes(1);
  });

  it("should process n elements of a MutableObservable", () => {
    const events = [10, 11, 12, 13, 14, 15];
    const mut$ = preProcess<number>(take(5));
    const completeCb = jest.fn();
    mut$.subscribe(
      subscriberOf((x) => expect(x).not.toEqual(15), void 0, completeCb)
    );
    mut$.next(...events);
    expect(completeCb).toHaveBeenCalledTimes(1);
  });

  it("should compile only two values", () => {
    const mut$ = mutable(10, 20, 30);
    mut$.subscribe((x) => expect([10, 20, 30].includes(x)).toEqual(true));
    mut$.compile(take(2));
    mut$.subscribe((x) => expect(x).not.toEqual(30));
  });

  it("should admit only three values for the fork", () => {
    const mut$ = mutable<number>();
    const fork$ = fork(mut$, take(3));
    const completeCb = jest.fn();
    fork$.subscribe(subscriberOf((x) => expect(x).not.toEqual(40), void 0, completeCb));
    mut$.next(10, 20, 30, 40);
    expect(completeCb).toHaveBeenCalledTimes(1);
  });

});
