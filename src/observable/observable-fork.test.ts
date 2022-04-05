import { filter, fork, map, mutable, until } from "../operators";
import { of } from "../operators/static/creation/of";
import { ObservableFork } from "./observable-fork";
import { fail } from "../../tests/helpers/function.helpers";
import { Observable } from "./observable";
import { Subscription } from "../models/subscription";

describe("ObservableFork", () => {
  it("will succeed", () => expect(true).toBe(true));

  describe("close", () => {
    it("should stop forked Observables", (done) => {
      const obs$ = fork(of(12));
      const fork1$ = fork(obs$);
      const fork2$ = fork(obs$);
      const fork3$ = fork(obs$);
      obs$.close();
      fork1$.subscribe(() => fail("fork1$ should have been closed"));
      fork2$.subscribe(() => fail("fork2$ should have been closed"));
      fork3$.subscribe(() => fail("fork3$ should have been closed"));
      obs$.subscribe({
        next: (x) => expect(x).toEqual(12),
        complete: () => done(),
      });
    });
  });

  describe("fork", () => {
    let forked$: ObservableFork<number>;
    it("should emit no value", () => {
      let obs$: Observable<number> = of();

      forked$ = fork(obs$);
      let sub = forked$.subscribe(() =>
        fail("No value should have been emitted")
      );

      expect((forked$ as any)._innerSequence).toEqual([]);
      sub.unsubscribe();

      obs$ = mutable();
      forked$ = fork(obs$);
      sub = forked$.subscribe(() => fail("No value should have been emitted"));

      expect((forked$ as any)._innerSequence).toEqual([]);
      sub.unsubscribe();
    });

    it("should emit origin value", () => {
      const obs$: Observable<number> = of(100);

      forked$ = fork(obs$);
      forked$.subscribe((x) => expect(x).toEqual(100));
    });

    it("should filter emitted values", () => {
      const mut$ = mutable(0);
      forked$ = fork(
        mut$,
        filter((x: number) => x > 20)
      );
      forked$.subscribe((x) => expect(x).toBeGreaterThan(20));
      mut$.next(10);
      mut$.next(30);
    });

    it("should map emitted values", () => {
      const mut$ = mutable<number>();
      forked$ = fork(
        mut$,
        map((x: number) => x * 2),
        map((x: number) => x + 5)
      );
      forked$.subscribe((x) => expect(x).toEqual(25));
      mut$.next(10);
    });

    it("should print values until the predicate is matched", async () => {
      const mut$ = mutable<number>();
      forked$ = fork(
        mut$,
        until((x: number) => x >= 10)
      );

      let i = 0;
      forked$.subscribe((value) =>
        i < 100 ? expect(value).toEqual(i) : expect(value).toEqual(10)
      );

      for (; i < 100; i++) {
        mut$.next(i);
      }
    });

    it("should throw an error", () => {
      let mut$ = mutable<number>(0);

      const thresholdError = new Error("Threshold error: value is > 100");

      forked$ = fork(
        mut$,
        map((x: number) => {
          if (x < 100) {
            return x;
          } else {
            throw thresholdError;
          }
        })
      );

      mut$.next(100);

      forked$.subscribe({
        next: () => fail("Forked should not go into next"),
        error: (err) => {
          expect(err).toEqual(thresholdError);
        },
      });
    });

    it("should complete the fork", () => {
      let mut$ = mutable<number>();

      forked$ = fork(
        mut$,
        until((x) => x > 0)
      );
      mut$.next(100);
      const completeCb = jest.fn();
      forked$.subscribe({
        next: (x) => expect(x).toEqual(100),
        error: () => fail(`Should not trigger the onError callback`),
        complete: completeCb
      });
      mut$.next(10000);
      expect(completeCb).toHaveBeenCalledTimes(1);
    });

    it("should set the fork on error", () => {
      const mut$ = mutable<number>();
      mut$.next(12);
      mut$.compile(
        map(() => {
          throw new Error("fork error");
        })
      );
      forked$ = fork(mut$);
      expect((forked$ as any)._error).toEqual(new Error("fork error"));
    });
  });

  describe("subscribe", () => {
    it("should throw an error", () => {
      const obs$ = fork(of());
      expect.assertions(1);
      try {
        obs$.subscribe(12 as any);
      } catch (err) {
        expect(err).toEqual(
          new Error("Please provide either a function or a Subscriber")
        );
      }
    });
  });

  describe('unsubscribe', () => {
    it('should call every unsubscribe method of subscriptions', () => {
      const forked$ = fork(of());
      const subscription = new Subscription();
      const unsubscribeSpy = jest.spyOn(subscription, 'unsubscribe');
      (forked$ as any).subscriptions.push(subscription);
      (forked$ as any).unsubscribe();
      expect(unsubscribeSpy).toHaveBeenNthCalledWith(1);
    });
  });
});
