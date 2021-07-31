import { Fleuve } from "./fleuve";
import { EventSubscription, Listener } from "./models/event";
import { Operator, OperatorFunction } from "./models/operator";
import { Subscriber } from "./models/subscription";
import { filter } from "./operators/filter";
import { map } from "./operators/map";
import { switchMap } from "./operators/switch-map";

describe("Fleuve", () => {
  function fail(message: string = "", ...args: any[]) {
    const errorMsg = `Test failed\n${message} ${args.reduce(
      (acc, curr) => `${acc} ${curr}`,
      ""
    )}`;
    throw new Error(errorMsg);
  }

  it("should create a new Fleuve with no emitting value", (done) => {
    const fleuve$ = new Fleuve();
    expect((fleuve$ as any)._innerValue).toEqual(undefined);
    expect((fleuve$ as any)._isStarted).toEqual(false);
    fleuve$.subscribe((value) => {
      fail("A value has been emitted. Should not. Value was:", value);
    });
    done();
  });

  it("should create a new Fleuve with an emitting value", (done) => {
    const value = { firstname: "john", lastname: "doe" };
    const fleuve$ = new Fleuve(value);
    fleuve$.subscribe((val) => {
      expect(val).toEqual(value);
      done();
    });
  });

  describe("subscribe", () => {
    it("should throw an error", () => {
      const fleuve$ = new Fleuve<number>();
      expect.assertions(1);
      try {
        fleuve$.subscribe(12 as any);
      } catch (err) {
        expect(err).toEqual(
          new Error("Please provide either a function or a Subscriber")
        );
      }
    });

    it("should add a subscriber to the list of subscribers", () => {
      const fleuve$ = new Fleuve();
      expect((fleuve$ as any)._subscribers.length).toEqual(0);
      fleuve$.subscribe(() => {});
      expect((fleuve$ as any)._subscribers.length).toEqual(1);
    });

    it("should not execute the subscriber", () => {
      const subscriber: Subscriber = Subscriber.of(jest.fn());
      const fleuve$ = new Fleuve();
      fleuve$.subscribe(subscriber);
      expect((subscriber as any)._onNext).not.toHaveBeenCalled();
    });

    it("should execute the subscriber", () => {
      const subscriber: Subscriber = Subscriber.of(jest.fn());
      const fleuve$ = new Fleuve<number>(12);
      fleuve$.subscribe(subscriber);
      expect((subscriber as any)._onNext).toHaveBeenNthCalledWith(1, 12);
      expect((fleuve$ as any)._isStarted).toEqual(true);
      fleuve$.next(undefined as any);
      expect((subscriber as any)._onNext).toHaveBeenNthCalledWith(2, undefined);
    });
  });

  describe("next", () => {
    it("should set the new values of a Fleuve", () => {
      const fleuve$ = new Fleuve<number>();
      expect((fleuve$ as any)._innerValue).toEqual(undefined);
      fleuve$.next(12);
      expect((fleuve$ as any)._innerValue).toEqual(12);
      fleuve$.next(12, 13, 14, 15, -1);
      expect((fleuve$ as any)._innerValue).toEqual(-1);
    });

    it("should trigger each subscriber of the Fleuve", () => {
      const fleuve$ = new Fleuve<number>();
      const subscriber1: Subscriber = Subscriber.of(jest.fn());
      const subscriber2: Subscriber = Subscriber.of(jest.fn());
      fleuve$.subscribe(subscriber1);
      fleuve$.subscribe(subscriber2);

      expect((subscriber1 as any)._onNext).not.toHaveBeenCalled();
      expect((subscriber2 as any)._onNext).not.toHaveBeenCalled();
      fleuve$.next(12, 13, 14, 15, -1);
      expect((subscriber1 as any)._onNext).toHaveBeenCalledTimes(5);
      expect((subscriber2 as any)._onNext).toHaveBeenCalledTimes(5);
    });

    it("should not call any subscriber of the Fleuve", () => {
      const fleuve$ = new Fleuve<number>();
      const subscriber1: Subscriber = Subscriber.of(jest.fn());
      const subscriber2: Subscriber = Subscriber.of(jest.fn());

      fleuve$.subscribe(subscriber1);
      fleuve$.subscribe(subscriber2);

      fleuve$.next();
      expect((subscriber1 as any)._onNext).not.toHaveBeenCalled();
      expect((subscriber2 as any)._onNext).not.toHaveBeenCalled();
    });

    it("should set _isStarted to true", () => {
      const fleuve$ = new Fleuve<number>();
      expect((fleuve$ as any)._isStarted).toEqual(false);
      fleuve$.next();
      expect((fleuve$ as any)._isStarted).toEqual(false);
      fleuve$.next(undefined as any);
      expect((fleuve$ as any)._isStarted).toEqual(true);
      fleuve$.next(12);
      expect((fleuve$ as any)._isStarted).toEqual(true);
      fleuve$.next(100, undefined as any, 12);
      expect((fleuve$ as any)._isStarted).toEqual(true);
    });
  });

  describe("pipe", () => {
    it("should return a new Fleuve with no value", () => {
      const fleuve$ = new Fleuve<number>();
      const pipedFleuve$ = fleuve$.pipe(map((value) => value * 2));
      expect((pipedFleuve$ as any)._isStarted).toEqual(false);
      expect((pipedFleuve$ as any)._innerValue).toEqual(undefined);
      pipedFleuve$.subscribe(() => {
        fail("Should not go there, Fleuve should not have been started");
      });
    });

    it("should return a new Fleuve with NaN", () => {
      const fleuve$ = new Fleuve(12);
      fleuve$.next(undefined as any);
      const pipedFleuve$ = fleuve$.pipe(map((x) => x * 2));
      pipedFleuve$.subscribe((value) => {
        expect((pipedFleuve$ as any)._isStarted).toEqual(true);
        expect(Number.isNaN(value)).toEqual(true);
      });
    });

    it("should return a new Fleuve with the original Fleuve's value and started", () => {
      const fleuve$ = new Fleuve(12);
      const pipedFleuve$ = fleuve$.pipe();

      pipedFleuve$.subscribe((value) => {
        expect(value).toEqual(12);
        expect((pipedFleuve$ as any)._isStarted).toEqual(true);
      });
    });

    it("should return a Fleuve(6)", () => {
      const fleuve$ = new Fleuve(12);
      const mappedFleuve$ = fleuve$.pipe(map((value) => value / 2));
      mappedFleuve$.subscribe((value) => expect(value).toEqual(6));
    });

    it("should return a Fleuve(12)", () => {
      const fleuve$ = new Fleuve(12);
      const filteredFleuve$ = fleuve$.pipe(filter((value) => value > 10));
      filteredFleuve$.subscribe((value) => expect(value).toEqual(12));
    });

    it("should return a filtered Fleuve with no value", () => {
      const fleuve$ = new Fleuve(12);
      const filteredFleuve$ = fleuve$.pipe(filter((value) => value < 10));
      expect((filteredFleuve$ as any)._isStarted).toEqual(false);
      expect((filteredFleuve$ as any)._innerValue).toEqual(undefined);
      filteredFleuve$.subscribe(() => {
        fail("Should not go there, Fleuve should not have been started");
      });
    });

    it('should return a Fleuve("FILTERED") and then a Fleuve(0)', () => {
      const fleuve$ = new Fleuve("FIL");
      const result$ = fleuve$.pipe(
        map((str) => str + "TERED"),
        filter((str) => !!str)
      );

      result$.subscribe((value) => expect(value).toEqual("FILTERED"));

      const result2$ = new Fleuve(1).pipe(
        map((x) => x - 1),
        filter((x) => x >= 0)
      );
      result2$.subscribe((value) => expect(value).toEqual(0));
    });

    it("should return a new Fleuve", () => {
      const fleuve$ = new Fleuve(12);
      const pipedFleuve$ = fleuve$.pipe(switchMap((x) => new Fleuve(x * 2)));
      pipedFleuve$.subscribe((value) => expect(value).toEqual(24));
    });

    it("should throw an error", () => {
      const thresholdError = new Error("Threshold error: value is > 100");
      const fleuve$ = new Fleuve(100);
      expect.assertions(1);
        fleuve$.pipe(
          map((x) => {
            if (x < 100) {
              return x;
            } else {
              throw thresholdError;
            }
          })
        ).subscribe(jest.fn(), (err) => expect(err).toEqual(thresholdError));
    });
  });

  describe("fork", () => {
    let fleuve$: Fleuve<number>;
    let forked$: Fleuve<number>;
    beforeEach(() => {
      fleuve$ = new Fleuve<number>();
    });

    it("should emit no value", () => {
      forked$ = fleuve$.fork();
      forked$.subscribe(() => fail("No value should have been emitted"));

      expect((forked$ as any)._isStarted).toEqual(false);
      expect((forked$ as any)._innerValue).toEqual(undefined);

      fleuve$.next();
      expect((forked$ as any)._isStarted).toEqual(false);
      expect((forked$ as any)._innerValue).toEqual(undefined);
    });

    it("should emit origin value", () => {
      forked$ = fleuve$.fork();
      forked$.subscribe((x) => expect(x).toEqual(100));
      fleuve$.next(100);
    });

    it("should filter emitted values", () => {
      forked$ = fleuve$.fork(filter((x) => x > 20));
      forked$.subscribe((x) =>
        expect(x).toBeGreaterThan(20)
      );
      fleuve$.next(10);
      fleuve$.next(30);
    });

    it("should map emitted values", () => {
      forked$ = fleuve$.fork(
        map((x) => x * 2),
        map((x) => x + 5)
      );
      forked$.subscribe((x) => expect(x).toEqual(25));
      fleuve$.next(10);
    });

    it("should throw an error", () => {
      const thresholdError = new Error("Threshold error: value is > 100");
      expect.assertions(1);

      forked$ = fleuve$.fork(
        map((x) => {
          if (x < 100) {
            return x;
          } else {
            throw thresholdError;
          }
        })
      );
      fleuve$.next(100);
      forked$.subscribe(jest.fn(), (err) => {expect(err).toEqual(thresholdError)});
    });
  });

  describe("addEventListener", () => {
    it("should throw an error", () => {
      jest.spyOn(document, "querySelector").mockReturnValue(null);
      expect.assertions(1);
      try {
        const fleuve$ = new Fleuve();
        fleuve$.addEventListener("", "", () => {});
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
      const fleuve$ = new Fleuve();
      fleuve$.addEventListener("test", "click", () => {});
      expect(dummyAddEventListener).toHaveBeenCalledWith(
        "click",
        expect.any(Function),
        undefined
      );
    });

    it("should call fleuve._createEventListenerFromListener", () => {
      jest
        .spyOn(document, "querySelector")
        .mockReturnValue({ addEventListener: jest.fn() } as any);
      const fleuve$ = new Fleuve();
      const _createEventListenerFromListenerSpy = jest.spyOn(
        fleuve$ as any,
        "_createEventListenerFromListener"
      );
      const listener: Listener = jest.fn();
      fleuve$.addEventListener("test", "click", listener);
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
      const fleuve$ = new Fleuve();
      const eventSubscription = fleuve$.addEventListener(
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
      const fleuve$ = new Fleuve();
      const listener = jest.fn();
      const eventListener = (fleuve$ as any)._createEventListenerFromListener(
        listener
      );
      expect(eventListener).toBeTruthy();
      eventListener();
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe("dam", () => {
    it("should stop forked Fleuves", () => {
      const fleuve$ = new Fleuve<number>();
      const fork1$ = fleuve$.fork();
      const fork2$ = fleuve$.fork();
      const fork3$ = fork2$.fork();
      fleuve$.dam();
      fork1$.subscribe(() => fail("fork1$ should have been damed"));
      fork2$.subscribe(() => fail("fork1$ should have been damed"));
      fork3$.subscribe(() => fail("fork1$ should have been damed"));
      fleuve$.subscribe((x) => expect(x).toEqual(12));
      fleuve$.next(12);
    });

    it("should not accept any new values but should still have the original value", () => {
      const fleuve$ = new Fleuve(12);
      const fork1$ = fleuve$.fork(map((x) => x * 2));
      const fork2$ = fork1$.fork(filter((x) => x < 100));

      fleuve$.dam();
      fork1$.subscribe((x) => expect(x).toEqual(24));
      fork2$.subscribe((x) => expect(x).toEqual(24));

      fleuve$.next(99);
    });
  });

  describe("compile", () => {
    it("should execute each function and set a new value", () => {
      const operations: OperatorFunction<number>[] = [
        jest.fn(),
        jest.fn(),
        jest.fn(),
      ];
      const fleuve$ = new Fleuve<number>();
      fleuve$.compile(...operations);
      fleuve$.subscribe(() => operations.forEach((operator) => expect(operator).toHaveBeenCalled()));
    });

    it("should update the _innerValue", () => {
      const operations: OperatorFunction<number>[] = [
        (x) => x * 2,
        (y) => y + 5,
        (z) => z / 5,
        filter((x) => x > 0),
      ];
      const fleuve$ = new Fleuve<number>(5);
      fleuve$.pile(...operations);
      fleuve$.subscribe((x: number) => expect(x).toEqual(3));
    });

    it("should not update the _innerValue", () => {
      const operations: OperatorFunction<number>[] = [
        (x) => x * 2,
        (y) => y + 5,
        (z) => z / 5,
        filter((x) => x > 100),
      ];
      const fleuve$ = new Fleuve<number>(5);
      fleuve$.pile(...operations);
      fleuve$.subscribe((x) => expect(x).toEqual(5));
    });

    it("should throw an error", () => {
      const thresholdError = new Error("Threshold error: value is > 100");
      const fleuve$ = new Fleuve(100);
      expect.assertions(1);
        fleuve$.compile(
          map((x) => {
            if (x < 100) {
              return x;
            } else {
              throw thresholdError;
            }
          })
        ).subscribe(jest.fn(), (err) => expect(err).toEqual(thresholdError));
    });
  });

  describe("compile", () => {
    it("should execute each function and set a new value", () => {
      const operations: OperatorFunction<number>[] = [
        jest.fn(),
        jest.fn(),
        jest.fn(),
      ];
      const fleuve$ = new Fleuve<number>();
      fleuve$.compile(...operations);
      fleuve$.subscribe(() => operations.forEach((operator) => expect(operator).toHaveBeenCalled()));
    });

    it("should update the _innerValue", () => {
      const operations: OperatorFunction<number>[] = [
        (x) => x * 2,
        (y) => y + 5,
        (z) => z / 5,
        filter((x) => x > 0),
      ];
      const fleuve$ = new Fleuve<number>(5);
      fleuve$.compile(...operations);
      fleuve$.subscribe((x: number) => expect(x).toEqual(3));
    });

    it("should not update the _innerValue", () => {
      const operations: OperatorFunction<number>[] = [
        (x) => x * 2,
        (y) => y + 5,
        (z) => z / 5,
        filter((x) => x > 100),
      ];
      const fleuve$ = new Fleuve<number>(5);
      fleuve$.compile(...operations);
      fleuve$.subscribe((x: number) => expect(x).toEqual(5));
    });

    it("should throw an thresholdError", () => {
      const thresholdError = new Error("Threshold error: value is > 100");
      const fleuve$ = new Fleuve(100);
      fleuve$.compile(
        map((x) => {
          if (x < 100) {
            return x;
          } else {
            throw thresholdError;
          }
        })
      );
      fleuve$.subscribe(
        Subscriber.of(
          (value) => expect(value).toEqual(100),
          (err) => expect(err).toEqual(thresholdError)
        )
      );
    });
  });
});
