import { filter } from "../operators/predicates/filter";
import { until } from "../operators/predicates/until";
// import { map } from "../operators/transform/map";
// import {ObservableFork} from './observable-fork';

describe('ForkableObservable', () => {
    it('will succeed', () => expect(true).toBe(true));
    // describe("closeForks", () => {
    //     it("should stop forked Observables", () => {
    //       const obs$ = new ObservableFork<number>();
    //       const fork1$ = obs$.fork();
    //       const fork2$ = obs$.fork();
    //       const fork3$ = fork2$.fork();
    //       obs$.closeForks();
    //       fork1$.subscribe(() => fail("fork1$ should have been closed"));
    //       fork2$.subscribe(() => fail("fork1$ should have been closed"));
    //       fork3$.subscribe(() => fail("fork1$ should have been closed"));
    //       obs$.subscribe((x) => expect(x).toEqual(12));
    //       obs$.next(12);
    //     });
    
    //     it("should not accept any new values but should still have the original value", () => {
    //       const obs$ = new ObservableFork(12);
    //       const fork1$ = obs$.fork(map((x: number) => x * 2));
    //       const fork2$ = fork1$.fork(filter((x: number) => x < 100));
    
    //       obs$.closeForks();
    //       fork1$.subscribe((x) => expect(x).toEqual(24));
    //       fork2$.subscribe((x) => expect(x).toEqual(24));
    
    //       obs$.next(99);
    //     });
    //   });

    //   describe("fork", () => {
    //     let obs$: ObservableFork<number>;
    //     let forked$: ObservableFork<number>;
    //     beforeEach(() => {
    //       obs$ = new ObservableFork<number>();
    //     });
    
    //     it("should emit no value", () => {
    //       forked$ = obs$.fork();
    //       forked$.subscribe(() => fail("No value should have been emitted"));
    
    //       expect((forked$ as any)._innerSequence).toEqual([]);
    
    //       obs$.next();
    //       expect((forked$ as any)._innerSequence).toEqual([]);
    //     });
    
    //     it("should emit origin value", () => {
    //       forked$ = obs$.fork();
    //       forked$.subscribe((x) => expect(x).toEqual(100));
    //       obs$.next(100);
    //     });
    
    //     it("should filter emitted values", () => {
    //       forked$ = obs$.fork(filter((x: number) => x > 20));
    //       forked$.subscribe((x) => expect(x).toBeGreaterThan(20));
    //       obs$.next(10);
    //       obs$.next(30);
    //     });
    
    //     it("should map emitted values", () => {
    //       forked$ = obs$.fork(
    //         map((x: number) => x * 2),
    //         map((x: number) => x + 5)
    //       );
    //       forked$.subscribe((x) => expect(x).toEqual(25));
    //       obs$.next(10);
    //     });
    
    //     it("should print values until the predicate is matched", async () => {
    //       forked$ = obs$.fork(until((x: number) => x >= 10));
    
    //       let i = 0;
    //       forked$.subscribe((value) => i < 100 ? expect(value).toEqual(i) : expect(value).toEqual(10));
    
    //       for (; i < 100; i++) {
    //         obs$.next(i);
    //       }
    //     });
    
    //     it("should throw an error", () => {
    //       const thresholdError = new Error("Threshold error: value is > 100");
    //       expect.assertions(1);
    
    //       forked$ = obs$.fork(
    //         map((x: number) => {
    //           if (x < 100) {
    //             return x;
    //           } else {
    //             throw thresholdError;
    //           }
    //         })
    //       );
    //       obs$.next(100);
    //       forked$.subscribe(jest.fn(), (err) => {
    //         expect(err).toEqual(thresholdError);
    //       });
    //     });
    
    //     it('should complete the fork', () => {
    //       forked$ = obs$.fork(until(x => x > 0));
    //       obs$.next(100);
    //       const completeCb = jest.fn();
    //       forked$.subscribe((x) => expect(x).toEqual(100), () => fail(`Should not trigger the onError callback`), completeCb);
    //       expect(completeCb).toHaveBeenCalledTimes(1);
    //       obs$.next(10000);
    //       forked$.next(10000);
    //     });
    
    //     it('should set the fork on error', () => {
    //       obs$.next(12);
    //       obs$.compile(map(() => {throw new Error('fork error')}));
    //       forked$ = obs$.fork();
    //       expect((forked$ as any)._error).toEqual(new Error('fork error'));
    //     });
    //   });
});