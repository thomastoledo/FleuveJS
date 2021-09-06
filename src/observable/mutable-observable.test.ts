import { OperatorFunction, OperationResult } from "../models/operator";
import { Subscriber, subscriberOf } from "../models/subscription";
import { filter } from "../operators/predicates/filter";
import { until } from "../operators/predicates/until";
import { map } from "../operators/transform/map";
import { MutableObservable } from "./mutable-observable";

describe('MutableObservable', () => {
    describe("closeForks", () => {
        it("should stop forked Observables", () => {
          const obs$ = new MutableObservable<number>();
          const fork1$ = obs$.fork();
          const fork2$ = obs$.fork();
          const fork3$ = fork2$.fork();
          obs$.closeForks();
          fork1$.subscribe(() => fail("fork1$ should have been closed"));
          fork2$.subscribe(() => fail("fork1$ should have been closed"));
          fork3$.subscribe(() => fail("fork1$ should have been closed"));
          obs$.subscribe((x) => expect(x).toEqual(12));
          obs$.next(12);
        });
    
        it("should not accept any new values but should still have the original value", () => {
          const obs$ = new MutableObservable(12);
          const fork1$ = obs$.fork(map((x: number) => x * 2));
          const fork2$ = fork1$.fork(filter((x: number) => x < 100));
    
          obs$.closeForks();
          fork1$.subscribe((x) => expect(x).toEqual(24));
          fork2$.subscribe((x) => expect(x).toEqual(24));
    
          obs$.next(99);
        });
      });

      describe("fork", () => {
        let obs$: MutableObservable<number>;
        let forked$: MutableObservable<number>;
        beforeEach(() => {
          obs$ = new MutableObservable<number>();
        });
    
        it("should emit no value", () => {
          forked$ = obs$.fork();
          forked$.subscribe(() => fail("No value should have been emitted"));
    
          expect((forked$ as any)._innerSequence).toEqual([]);
    
          obs$.next();
          expect((forked$ as any)._innerSequence).toEqual([]);
        });
    
        it("should emit origin value", () => {
          forked$ = obs$.fork();
          forked$.subscribe((x) => expect(x).toEqual(100));
          obs$.next(100);
        });
    
        it("should filter emitted values", () => {
          forked$ = obs$.fork(filter((x: number) => x > 20));
          forked$.subscribe((x) => expect(x).toBeGreaterThan(20));
          obs$.next(10);
          obs$.next(30);
        });
    
        it("should map emitted values", () => {
          forked$ = obs$.fork(
            map((x: number) => x * 2),
            map((x: number) => x + 5)
          );
          forked$.subscribe((x) => expect(x).toEqual(25));
          obs$.next(10);
        });
    
        it("should print values until the predicate is matched", async () => {
          forked$ = obs$.fork(until((x: number) => x >= 10));
    
          let i = 0;
          forked$.subscribe((value) => i < 100 ? expect(value).toEqual(i) : expect(value).toEqual(10));
    
          for (; i < 100; i++) {
            obs$.next(i);
          }
        });
    
        it("should throw an error", () => {
          const thresholdError = new Error("Threshold error: value is > 100");
          expect.assertions(1);
    
          forked$ = obs$.fork(
            map((x: number) => {
              if (x < 100) {
                return x;
              } else {
                throw thresholdError;
              }
            })
          );
          obs$.next(100);
          forked$.subscribe(jest.fn(), (err) => {
            expect(err).toEqual(thresholdError);
          });
        });
    
        it('should complete the fork', () => {
          forked$ = obs$.fork(until(x => x > 0));
          obs$.next(100);
          const completeCb = jest.fn();
          forked$.subscribe((x) => expect(x).toEqual(100), () => fail(`Should not trigger the onError callback`), completeCb);
          expect(completeCb).toHaveBeenCalledTimes(1);
          obs$.next(10000);
          forked$.next(10000);
        });
    
        it('should set the fork on error', () => {
          obs$.next(12);
          obs$.compile(map(() => {throw new Error('fork error')}));
          forked$ = obs$.fork();
          expect((forked$ as any)._error).toEqual(new Error('fork error'));
        });
      });

      describe("compile", () => {
        it("should execute each function and set a new value", () => {
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
          (obs$ as any)._complete();
          const operations: OperatorFunction<number, OperationResult<any>>[] = [
            map((x) => x * 2),
            map((y) => y + 5),
            map((z) => z / 5),
            filter((x: number) => x > 100),
          ];
          obs$.compile(...operations);
          obs$.subscribe((x) => expect(x).toEqual(5));
        });
    
        it('should not update the _innerSequence if the observable must stop', () => {
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
          expect.assertions(1);
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
            .subscribe(jest.fn(), (err) => expect(err).toEqual(thresholdError));
        });
      });

      describe("next", () => {
        it("should set the new values of a Observable", () => {
          const obs$ = new MutableObservable<number>();
          expect((obs$ as any)._innerSequence).toEqual([]);
          obs$.next(12);
          expect((obs$ as any)._innerSequence).toEqual([12]);
          obs$.next(12, 13, 14, 15, -1);
          expect((obs$ as any)._innerSequence).toEqual([12, 13, 14, 15, -1]);
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
          (obs$ as any)._preProcessOperations = [filter(x => x < 100)];
          obs$.next(200);
          expect(subscriber1.next).not.toHaveBeenCalled();
          expect(subscriber2.next).not.toHaveBeenCalled();
        });
      });

      describe('close', () => {
        it('should close the Observable', (done) => {
          const obs$ = new MutableObservable<number>();
          obs$.subscribe({next: () => fail('MutableObservable should have been closed'), complete: () => done()});
          obs$.close();
        });
      });
});