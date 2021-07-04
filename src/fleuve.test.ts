import { Fleuve } from "./fleuve";
import { EventSubscription, Subscriber } from "./models/event";
import { filter } from "./operators/filter";
import { map } from "./operators/map";

describe("Fleuve", () => {
  function fail(message?: string, ...args: any[]) {
    const errorMsg = `${message} ${args.reduce(
      (acc, curr) => `${acc} ${curr}`,
      ""
    )}`;
    throw new Error(errorMsg);
  }

  test("should create a new Fleuve with no emitting value", (done) => {
    const fleuve$ = new Fleuve();
    expect((fleuve$ as any)._innerValue).toEqual(undefined);
    expect((fleuve$ as any)._isStarted).toEqual(false);
    fleuve$.subscribe((value) => {
      fail("A value has been emitted. Should not. Value was:", value);
    });
    done();
  });

  test("should create a new Fleuve with an emitting value", (done) => {
    const value = { firstname: "john", lastname: "doe" };
    const fleuve$ = new Fleuve(value);
    fleuve$.subscribe((val) => {
      expect(val).toEqual(value);
      done();
    });
  });

  describe("subscribe", () => {
    test("should throw an error", () => {
      const fleuve$ = new Fleuve<number>();
      try {
        fleuve$.subscribe(12 as any);
        fail("An error should have been thrown: 12 is not a function");
      } catch (err) {
        expect(err).toEqual(new Error("Please provide a function"));
      }
    });

    test("should add a subscriber to the list of subscribers", () => {
      const fleuve$ = new Fleuve();
      expect((fleuve$ as any)._subscribers.length).toEqual(0);
      fleuve$.subscribe(() => {});
      expect((fleuve$ as any)._subscribers.length).toEqual(1);
    });

    test("should not execute the subscriber", () => {
      const subscriber: Subscriber = jest.fn();
      const fleuve$ = new Fleuve();
      fleuve$.subscribe(subscriber);
      expect(subscriber).not.toHaveBeenCalled();
    });

    test("should execute the subscriber", () => {
      const subscriber: Subscriber = jest.fn();
      const fleuve$ = new Fleuve<number>(12);
      fleuve$.subscribe(subscriber);
      expect(subscriber).toHaveBeenNthCalledWith(1, 12);
      expect((fleuve$ as any)._isStarted).toEqual(true);
      fleuve$.next(undefined as any);
      expect(subscriber).toHaveBeenNthCalledWith(2, undefined);
    });
  });

  describe("next", () => {
    test("should set the new values of a Fleuve", () => {
      const fleuve$ = new Fleuve<number>();
      expect((fleuve$ as any)._innerValue).toEqual(undefined);
      fleuve$.next(12);
      expect((fleuve$ as any)._innerValue).toEqual(12);
      fleuve$.next(12, 13, 14, 15, -1);
      expect((fleuve$ as any)._innerValue).toEqual(-1);
    });

    test("should trigger each subscriber of the Fleuve", () => {
      const fleuve$ = new Fleuve<number>();
      const subscriber1: Subscriber = jest.fn();
      const subscriber2: Subscriber = jest.fn();

      fleuve$.subscribe(subscriber1);
      fleuve$.subscribe(subscriber2);

      expect(subscriber1).not.toHaveBeenCalled();
      expect(subscriber2).not.toHaveBeenCalled();
      fleuve$.next(12, 13, 14, 15, -1);
      expect(subscriber1).toHaveBeenCalledTimes(5);
      expect(subscriber2).toHaveBeenCalledTimes(5);
    });

    test("should not call any subscriber of the Fleuve", () => {
      const fleuve$ = new Fleuve<number>();
      const subscriber1: Subscriber = jest.fn();
      const subscriber2: Subscriber = jest.fn();

      fleuve$.subscribe(subscriber1);
      fleuve$.subscribe(subscriber2);

      fleuve$.next();
      expect(subscriber1).not.toHaveBeenCalled();
      expect(subscriber2).not.toHaveBeenCalled();
    });

    test("should set _isStarted to true", () => {
      const fleuve$ = new Fleuve<number>();
      expect((fleuve$ as any)._isStarted).toEqual(false);
      fleuve$.next();
      expect((fleuve$ as any)._isStarted).toEqual(false);
      fleuve$.next(undefined as any);
      expect((fleuve$ as any)._isStarted).toEqual(false);
      fleuve$.next(12);
      expect((fleuve$ as any)._isStarted).toEqual(true);
      fleuve$.next(100, undefined as any, 12);
      expect((fleuve$ as any)._isStarted).toEqual(true);
    });
  });

  describe("pipe", () => {
    test("should return a new Fleuve with no value", () => {
      const fleuve$ = new Fleuve<number>();
      const pipedFleuve$ = fleuve$.pipe(map((value) => value * 2));
      expect((pipedFleuve$ as any)._isStarted).toEqual(false);
      expect((pipedFleuve$ as any)._innerValue).toEqual(undefined);
      pipedFleuve$.subscribe(() => {
        fail("Should not go there, Fleuve should not have been started");
      });
    });

    test("should return a new Fleuve with NaN", () => {
      const fleuve$ = new Fleuve(12);
      fleuve$.next(undefined as any);
      const pipedFleuve$ = fleuve$.pipe(map((x) => x * 2));
      expect((pipedFleuve$ as any)._isStarted).toEqual(true);
      expect(Number.isNaN((pipedFleuve$ as any)._innerValue)).toEqual(true);
    });

    test("should return a new Fleuve with an undefined value and not started", () => {
      const fleuve$ = new Fleuve(12);
      const pipedFleuve$ = fleuve$.pipe();
      expect((pipedFleuve$ as any)._innerValue).toEqual(undefined);
      expect((pipedFleuve$ as any)._isStarted).toEqual(false);
    });

    test("should return a Fleuve(6)", () => {
      const fleuve$ = new Fleuve(12);
      const mappedFleuve$ = fleuve$.pipe(map((value) => value / 2));
      expect((mappedFleuve$ as any)._innerValue).toEqual(6);
    });

    test("should return a Fleuve(12)", () => {
      const fleuve$ = new Fleuve(12);
      const filteredFleuve$ = fleuve$.pipe(filter((value) => value > 10));
      expect((filteredFleuve$ as any)._innerValue).toEqual(12);
    });

    test("should return a filtered Fleuve with no value", () => {
      const fleuve$ = new Fleuve(12);
      const filteredFleuve$ = fleuve$.pipe(filter((value) => value < 10));
      expect((filteredFleuve$ as any)._isStarted).toEqual(false);
      expect((filteredFleuve$ as any)._innerValue).toEqual(undefined);
      filteredFleuve$.subscribe(() => {
        fail("Should not go there, Fleuve should not have been started");
      });
    });

    test('should return a Fleuve("FILTERED") and then a Fleuve(0)', () => {
      const fleuve$ = new Fleuve("FIL");
      const result$ = fleuve$.pipe(
        map((str) => str + "TERED"),
        filter((str) => !!str)
      );
      expect((result$ as any)._innerValue).toEqual("FILTERED");

      const result2$ = new Fleuve(1).pipe(
        map((x) => x - 1),
        filter((x) => x >= 0)
      );
      expect((result2$ as any)._innerValue).toEqual(0);
    });
  });

  describe("fork", () => {
    test("should fork into a new Fleuve with the old one as a source", () => {
      const fleuve$ = new Fleuve<number>();
      const subscriber = jest.fn();
      const forked$ = fleuve$.fork(filter((x) => x > 15));

      forked$.subscribe(subscriber);
      expect(subscriber).not.toHaveBeenCalled();
      fleuve$.next(12);
      expect(subscriber).not.toHaveBeenCalled();
      fleuve$.next(20);
      expect(subscriber).toHaveBeenNthCalledWith(1, 20);
    });
  });

  describe("addEventListener", () => {
    let querySelectorSpy: jest.SpyInstance;
    let addEventListenerSpy: jest.SpyInstance;
    let elem: Element;
    beforeEach(() => {
      addEventListenerSpy = jest.fn();
      elem = { addEventListener: addEventListenerSpy } as any;
      querySelectorSpy = jest
        .spyOn(document, "querySelector")
        .mockReturnValue(elem);
    });

    test("should return a new EventSubscription", () => {
      const fleuve$ = new Fleuve();
      const subscription = fleuve$.addEventListener('', '', () => {});
      expect(subscription).toEqual(new EventSubscription(elem, '', (event: Event) => () => {}));
    });
  });
});
