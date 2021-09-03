import { Observable } from "./observable";
import { EventSubscription, Listener } from "../models/event";
import { OperationResult, OperatorFunction } from "../models/operator";
import { subscriberOf, OnNext, Subscriber } from "../models/subscription";
import { filter } from "../operators/predicates/filter";
import { map } from "../operators/transform/map";
import { until } from "../operators/predicates/until";
import { switchMap } from "../operators/transform/switch-map";

describe("Observable", () => {
  function fail(message: string = "", ...args: any[]) {
    const errorMsg = `Test failed\n${message} ${args.reduce(
      (acc, curr) => `${acc} ${curr}`,
      ""
    )}`;
    throw new Error(errorMsg);
  }

  it("should create a new Observable with no emitting value", (done) => {
    const obs$ = new Observable();
    expect((obs$ as any)._innerValue).toEqual(undefined);
    expect((obs$ as any)._isStarted).toEqual(false);
    obs$.subscribe((value) => {
      fail("A value has been emitted. Should not. Value was:", value);
    });
    done();
  });

  it("should create a new Observable with an emitting value", (done) => {
    const value = { firstname: "john", lastname: "doe" };
    const obs$ = new Observable(value);
    obs$.subscribe((val) => {
      expect(val).toEqual(value);
      done();
    });
  });

  describe("subscribe", () => {
    it("should throw an error", () => {
      const obs$ = new Observable<number>();
      expect.assertions(1);
      try {
        obs$.subscribe(12 as any);
      } catch (err) {
        expect(err).toEqual(
          new Error("Please provide either a function or a Subscriber")
        );
      }
    });

    it("should add a subscriber to the list of subscribers", () => {
      const obs$ = new Observable();
      expect((obs$ as any)._subscribers.length).toEqual(0);
      obs$.subscribe(() => {});
      expect((obs$ as any)._subscribers.length).toEqual(1);
    });

    it("should not execute the subscriber", () => {
      const subscriber: Subscriber = subscriberOf(jest.fn());
      const obs$ = new Observable();
      obs$.subscribe(subscriber);
      expect(subscriber.next).not.toHaveBeenCalled();
    });

    it("should execute the subscriber", () => {
      const subscriber: Subscriber = subscriberOf(jest.fn());
      const obs$ = new Observable<number>(12);
      obs$.subscribe(subscriber);
      expect(subscriber.next).toHaveBeenNthCalledWith(1, 12);
      expect((obs$ as any)._isStarted).toEqual(true);
      obs$.next(undefined as any);
      expect(subscriber.next).toHaveBeenNthCalledWith(2, undefined);
    });

    it("should execute onNext", () => {
      const onNext: OnNext<number> = jest.fn();
      const obs$ = new Observable<number>(12);
      obs$.subscribe(onNext);
      expect(onNext).toHaveBeenNthCalledWith(1, 12);
      expect((obs$ as any)._isStarted).toEqual(true);
      obs$.next(undefined as any);
      expect(onNext).toHaveBeenNthCalledWith(2, undefined);
    });

    it('should execute onComplete with the error', () => {
      const obs$ = new Observable(12);
      obs$.compile(map(() => {throw new Error('')}));
      expect.assertions(1);
      obs$.subscribe({next: () => fail(), complete: (final) => expect(final).toEqual(new Error(''))});
    });

    it('should execute onComplete with the value', () => {
      const obs$ = new Observable(12);
      obs$.subscribe({next: jest.fn(), complete: (final) => expect(final).toEqual(12)});
    });
  });

  describe("next", () => {
    it("should set the new values of a Observable", () => {
      const obs$ = new Observable<number>();
      expect((obs$ as any)._innerValue).toEqual(undefined);
      obs$.next(12);
      expect((obs$ as any)._innerValue).toEqual(12);
      obs$.next(12, 13, 14, 15, -1);
      expect((obs$ as any)._innerValue).toEqual(-1);
    });

    it("should trigger each subscriber of the Observable", () => {
      const obs$ = new Observable<number>();
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

    it("should not call any subscriber of the Observable", () => {
      const obs$ = new Observable<number>();
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

    it("should set _isStarted to true", () => {
      const obs$ = new Observable<number>();
      expect((obs$ as any)._isStarted).toEqual(false);
      obs$.next();
      expect((obs$ as any)._isStarted).toEqual(false);
      obs$.next(undefined as any);
      expect((obs$ as any)._isStarted).toEqual(true);
      obs$.next(12);
      expect((obs$ as any)._isStarted).toEqual(true);
      obs$.next(100, undefined as any, 12);
      expect((obs$ as any)._isStarted).toEqual(true);
    });
  });

  describe("pipe", () => {
    it("should return a new Observable with no value", () => {
      const obs$ = new Observable<number>();
      const pipedobs$ = obs$.pipe(map((value: number) => value * 2));
      expect((pipedobs$ as any)._isStarted).toEqual(false);
      expect((pipedobs$ as any)._innerValue).toEqual(undefined);
      pipedobs$.subscribe(() => {
        fail("Should not go there, Observable should not have been started");
      });
    });

    it("should return a new Observable with NaN", () => {
      const obs$ = new Observable(12);
      obs$.next(undefined as any);
      const pipedobs$ = obs$.pipe(map((x: number) => x * 2));
      pipedobs$.subscribe((value) => {
        expect((pipedobs$ as any)._isStarted).toEqual(true);
        expect(Number.isNaN(value)).toEqual(true);
      });
    });

    it("should return a new Observable with the original Observable's value and started", () => {
      const obs$ = new Observable(12);
      const pipedobs$ = obs$.pipe();

      pipedobs$.subscribe((value) => {
        expect(value).toEqual(12);
        expect((pipedobs$ as any)._isStarted).toEqual(true);
      });
    });

    it("should return a Observable(6)", () => {
      const obs$ = new Observable(12);
      const mappedobs$ = obs$.pipe(map((value: number) => value / 2));
      mappedobs$.subscribe((value) => expect(value).toEqual(6));
    });

    it("should return a Observable(12)", () => {
      const obs$ = new Observable(12);
      const filteredobs$ = obs$.pipe(
        filter((value: number) => value > 10)
      );
      filteredobs$.subscribe((value) => expect(value).toEqual(12));
    });

    it("should return a filtered Observable with no value", () => {
      const obs$ = new Observable(12);
      const filteredobs$ = obs$.pipe(
        filter((value: number) => value < 10)
      );
      expect((filteredobs$ as any)._isStarted).toEqual(false);
      expect((filteredobs$ as any)._innerValue).toEqual(undefined);
      filteredobs$.subscribe(() => {
        fail("Should not go there, Observable should not have been started");
      });
    });

    it('should return a Observable("FILTERED") and then a Observable(0)', () => {
      const obs$ = new Observable("FIL");
      const result$ = obs$.pipe(
        map((str: string) => str + "TERED"),
        filter((str: any) => !!str)
      );

      result$.subscribe((value) => expect(value).toEqual("FILTERED"));

      const result2$ = new Observable(1).pipe(
        map((x: number) => x - 1),
        filter((x: number) => x >= 0)
      );
      result2$.subscribe((value) => expect(value).toEqual(0));
    });

    it("should return a new Observable", () => {
      const obs$ = new Observable(12);
      const pipedobs$ = obs$.pipe(
        switchMap((x: number) => new Observable(x * 2))
      );
      pipedobs$.subscribe((value) => expect(value).toEqual(24));
    });

    it("should throw an error", () => {
      const thresholdError = new Error("Threshold error: value is > 100");
      const obs$ = new Observable(100);
      expect.assertions(1);
      obs$
        .pipe(
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

    it('should return a Observable with an error', () => {
      const obs$ = new Observable();
      (obs$ as any)._error = new Error('');
      expect.assertions(1);
      obs$.pipe(map((x) => x * 2)).subscribe(() => fail(), (err) => expect(err).toEqual(new Error('')));
    });
  });

  describe("fork", () => {
    let obs$: Observable<number>;
    let forked$: Observable<number>;
    beforeEach(() => {
      obs$ = new Observable<number>();
    });

    it("should emit no value", () => {
      forked$ = obs$.fork();
      forked$.subscribe(() => fail("No value should have been emitted"));

      expect((forked$ as any)._isStarted).toEqual(false);
      expect((forked$ as any)._innerValue).toEqual(undefined);

      obs$.next();
      expect((forked$ as any)._isStarted).toEqual(false);
      expect((forked$ as any)._innerValue).toEqual(undefined);
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

      forked$.subscribe((value) => expect(value).toEqual(-1000));

      for (let i = 0; i < 100; i++) {
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
      obs$.compile(map(() => {throw new Error('')}));
      forked$ = obs$.fork();
      expect((forked$ as any)._error).toEqual(new Error(''));
    });
  });

  describe("addEventListener", () => {
    it("should throw an error", () => {
      jest.spyOn(document, "querySelector").mockReturnValue(null);
      expect.assertions(1);
      try {
        const obs$ = new Observable();
        obs$.addEventListener("", "", () => {});
      } catch (err) {
        expect(err).toEqual(
          new Error(`Could not find any element with selector ""`)
        );
      }
    });

    it("should call element.addEventListener", () => {
      const dummyAddEventListener = jest.fn();
      const dummyElem: Element = {
        addEventListener: dummyAddEventListener,
      } as any;
      jest.spyOn(document, "querySelector").mockReturnValue(dummyElem);
      const obs$ = new Observable();
      obs$.addEventListener("test", "click", () => {});
      expect(dummyAddEventListener).toHaveBeenCalledWith(
        "click",
        expect.any(Function),
        undefined
      );
    });

    it("should call observable._createEventListenerFromListener", () => {
      jest
        .spyOn(document, "querySelector")
        .mockReturnValue({ addEventListener: jest.fn() } as any);
      const obs$ = new Observable();
      const _createEventListenerFromListenerSpy = jest.spyOn(
        obs$ as any,
        "_createEventListenerFromListener"
      );
      const listener: Listener = jest.fn();
      obs$.addEventListener("test", "click", listener);
      expect(_createEventListenerFromListenerSpy).toHaveBeenCalledWith(
        listener
      );
    });

    it("should return an event subscription", () => {
      const dummyAddEventListener = jest.fn();
      const dummyRemoveEventListener = jest.fn();
      const dummyElem: Element = {
        addEventListener: dummyAddEventListener,
        removeEventListener: dummyRemoveEventListener,
      } as any;
      const dummyListener = jest.fn();
      jest.spyOn(document, "querySelector").mockReturnValue(dummyElem);
      const obs$ = new Observable();
      const eventSubscription = obs$.addEventListener(
        "test",
        "click",
        dummyListener
      );
      expect(eventSubscription).toBeInstanceOf(EventSubscription);

      eventSubscription.unsubscribe();
      expect(dummyRemoveEventListener).toHaveBeenNthCalledWith(
        1,
        "click",
        expect.any(Function)
      );
    });
  });

  describe("_createEventListenerFromListener", () => {
    it("should return an eventListener", () => {
      const obs$ = new Observable();
      const listener = jest.fn();
      const eventListener = (obs$ as any)._createEventListenerFromListener(
        listener
      );
      expect(eventListener).toBeTruthy();
      eventListener();
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it("should return an eventListener but never call it", () => {
      const obs$ = new Observable();
      (obs$ as any)._error = new Error("");
      const listener = jest.fn();
      const eventListener = (obs$ as any)._createEventListenerFromListener(
        listener
      );
      expect(eventListener).toBeTruthy();
      eventListener();
      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('close', () => {
    it('should close the Observable', () => {
      const obs$ = new Observable<number>();
      obs$.subscribe(() => fail('Observable should have been closed'));
      obs$.close();
      obs$.next(12);
    });
  });

  describe("closeForks", () => {
    it("should stop forked Observables", () => {
      const obs$ = new Observable<number>();
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
      const obs$ = new Observable(12);
      const fork1$ = obs$.fork(map((x: number) => x * 2));
      const fork2$ = fork1$.fork(filter((x: number) => x < 100));

      obs$.closeForks();
      fork1$.subscribe((x) => expect(x).toEqual(24));
      fork2$.subscribe((x) => expect(x).toEqual(24));

      obs$.next(99);
    });
  });

  describe("compile", () => {
    it("should execute each function and set a new value", () => {
      const operations: OperatorFunction<number, OperationResult<any>>[] = [
        jest.fn(),
        jest.fn(),
        jest.fn(),
      ];
      const obs$ = new Observable<number>();
      obs$.compile(...operations);
      obs$.subscribe(() =>
        operations.forEach((operator) => expect(operator).toHaveBeenCalled())
      );
    });

    it("should update the _innerValue", () => {
      const operations: OperatorFunction<number, OperationResult<any>>[] = [
        map((x) => x * 2),
        map((y) => y + 5),
        map((z) => z / 5),
        filter((x: number) => x > 0),
      ];
      const obs$ = new Observable<number>(5);
      obs$.compile(...operations);
      obs$.subscribe((x: number) => expect(x).toEqual(3));
    });

    it("should not update the _innerValue if a filter predicate is not matched", () => {
      const operations: OperatorFunction<number, OperationResult<any>>[] = [
        map((x) => x * 2),
        map((y) => y + 5),
        map((z) => z / 5),
        filter((x: number) => x > 100),
      ];
      const obs$ = new Observable<number>(5);
      obs$.compile(...operations);
      obs$.subscribe((x) => expect(x).toEqual(5));
    });

    it("should not update the _innerValue if the observable is in error", () => {
      const obs$ = new Observable<number>(5);
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

    it("should not update the _innerValue if the observable is already complete", () => {
      const obs$ = new Observable<number>(5);
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

    it('should not update the _innerValue if the observable must stop', () => {
      const obs$ = new Observable<number>(5);
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
      const obs$ = new Observable(100);
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
});
