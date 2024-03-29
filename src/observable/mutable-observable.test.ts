import { OperatorFunction, OperationResult } from "../models/operator";
import { Subscriber, subscriberOf } from "../models/subscription";
import { filter } from "../operators/predicates/filter";
import { until } from "../operators/predicates/until";
import { map } from "../operators/transform/map";
import { MutableObservable } from "./mutable-observable";
import { fail } from "../helpers/function.helper";
import { mutable } from "../operators";

describe("MutableObservable", () => {
  describe("compile", () => {
    it("should execute each function", () => {
      const operations: OperatorFunction<number, OperationResult<any>>[] = [
        jest.fn(),
        jest.fn(),
        jest.fn(),
      ];
      const obs$ = new MutableObservable<number>();
      obs$.compile(...operations);
      obs$.subscribe(() =>
        operations.forEach((operator) => expect(operator).toHaveBeenCalled())
      );
    });

    it("should update the _innerSequence", () => {
      const operations: OperatorFunction<number, OperationResult<any>>[] = [
        map((x) => x * 2),
        map((y) => y + 5),
        map((z) => z / 5),
        filter((x: number) => x > 0),
      ];
      const obs$ = new MutableObservable<number>(5);
      obs$.compile(...operations);
      obs$.subscribe((x: number) => expect(x).toEqual(3));
    });

    it("should not update the _innerSequence if a filter predicate is not matched", () => {
      const operations: OperatorFunction<number, OperationResult<any>>[] = [
        map((x) => x * 2),
        map((y) => y + 5),
        map((z) => z / 5),
        filter((x: number) => x > 100),
      ];
      const obs$ = new MutableObservable<number>(5);
      obs$.compile(...operations);
      obs$.subscribe((x) => expect(x).toEqual(5));
    });

    it("should not update the _innerSequence if the observable is in error", () => {
      const obs$ = new MutableObservable<number>(5);
      (obs$ as any)._error = new Error("");
      const operations: OperatorFunction<number, OperationResult<any>>[] = [
        map((x) => x * 2),
        map((y) => y + 5),
        map((z) => z / 5),
        filter((x: number) => x > 100),
      ];
      obs$.compile(...operations);
      obs$.subscribe((x) => expect(x).toEqual(5));
    });

    it("should not update the _innerSequence if the observable is already complete", () => {
      const obs$ = new MutableObservable<number>(5);
      obs$.close();
      const operations: OperatorFunction<number, OperationResult<any>>[] = [
        map((x) => x * 2),
        map((y) => y + 5),
        map((z) => z / 5),
        filter((x: number) => x > 100),
      ];
      obs$.compile(...operations);
      obs$.subscribe((x) => expect(x).toEqual(5));
    });

    it("should not update the _innerSequence if the observable must stop", () => {
      const obs$ = new MutableObservable<number>(5);
      const operations: OperatorFunction<number, OperationResult<any>>[] = [
        map((x) => x * 2),
        map((y) => y + 5),
        map((z) => z / 5),
        until((x: number) => x > 0),
      ];

      obs$.compile(...operations);
      obs$.subscribe((x) => expect(x).toEqual(5));
    });

    it("should throw an error", () => {
      const thresholdError = new Error("Threshold error: value is > 100");
      const obs$ = new MutableObservable(100);
      obs$
        .compile(
          map((x: number) => {
            if (x < 100) {
              return x;
            } else {
              throw thresholdError;
            }
          })
        )
        .subscribe({
          next: (x) => {
            fail("Should not next");
          },
          error: (err) => {
            expect(err).toEqual(thresholdError);
          },
        });
    });
  });

  describe("next", () => {
    it("should set the new values of a Observable", () => {
      const obs$ = new MutableObservable<number>();
      expect((obs$ as any).innerSequence).toEqual([]);
      obs$.next(12);
      expect(
        (obs$ as any).innerSequence.map(
          (item: OperationResult<number>) => item.value
        )
      ).toEqual([12]);
      obs$.next(12, 13, 14, 15, -1);
      expect(
        (obs$ as any).innerSequence.map(
          (item: OperationResult<number>) => item.value
        )
      ).toEqual([12, 13, 14, 15, -1]);
    });

    it("should trigger each subscriber of the Observable", () => {
      const obs$ = new MutableObservable<number>();
      const subscriber1: Subscriber = subscriberOf(jest.fn());
      const subscriber2: Subscriber = subscriberOf(jest.fn());
      obs$.subscribe(subscriber1);
      obs$.subscribe(subscriber2);

      expect(subscriber1.next).not.toHaveBeenCalled();
      expect(subscriber2.next).not.toHaveBeenCalled();
      obs$.next(12, 13, 14, 15, -1);
      expect(subscriber1.next).toHaveBeenCalledTimes(5);
      expect(subscriber2.next).toHaveBeenCalledTimes(5);
    });

    it("should not call any subscriber of the MutableObservable", () => {
      const obs$ = new MutableObservable<number>();
      const subscriber1: Subscriber = subscriberOf(jest.fn());
      const subscriber2: Subscriber = subscriberOf(jest.fn());

      obs$.subscribe(subscriber1);
      obs$.subscribe(subscriber2);

      obs$.next();
      (obs$ as any)._preProcessOperations = [filter((x) => x < 100)];
      obs$.next(200);
      expect(subscriber1.next).not.toHaveBeenCalled();
      expect(subscriber2.next).not.toHaveBeenCalled();
    });

    it('should return without doing anything', () => {
      const obs$ = mutable<number>().close();
      const spyBuildNewSequence = jest.spyOn((obs$ as any), '_buildNewSequence');
      const spyTriggerExecution = jest.spyOn((obs$ as any), '_triggerExecution');

      obs$.next(12);
        expect(spyBuildNewSequence).not.toHaveBeenCalled();
        expect(spyTriggerExecution).not.toHaveBeenCalled();
    });
  });

  describe("close", () => {
    it("should close the Observable and trigger subscribers", () => {
      const obs$ = mutable<number>();
      const completeCb = jest.fn();
      obs$.subscribe({
        next: () => fail("No value should have been emited"),
        complete: completeCb,
      });
      obs$.close();
      expect(completeCb).toHaveBeenCalledTimes(1);
    });

    it('should do nothing if the Observable is already closed', () => {
      const obs$ = mutable<number>().close();
      const completeCb = jest.fn();
      obs$.subscribe({complete: completeCb});
      obs$.close();
      expect(completeCb).toBeCalledTimes(1);
    });
  });
});
