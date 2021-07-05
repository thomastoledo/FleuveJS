import { Fleuve } from "./fleuve";
import { EventSubscription, Listener, Subscriber } from "./models/event";
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
      expect((fleuve$ as any)._isStarted).toEqual(true);
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

    test('should throw an error', () => {
      const thresholdError = new Error('Threshold error: value is > 100');
      const fleuve$ = new Fleuve(100);
      
      try {
        fleuve$.pipe(map(x => {
          if (x < 100) {
            return x;
          } else {
            throw thresholdError;
          }
        }));  
        fail('The following error should have been thrown, but was not:', thresholdError);
      } catch (err) {
        expect(err).toEqual(thresholdError);
      }

    });
  });

  describe("fork", () => {
    let fleuve$: Fleuve<number>;
    let forked$: Fleuve<number>;
    beforeEach(() => {
      fleuve$ = new Fleuve<number>();
    });

    test("should emit no value", () => {
      forked$ = fleuve$.fork();
      forked$.subscribe(() => fail('No value should have been emitted'));

      expect((forked$ as any)._isStarted).toEqual(false);
      expect((forked$ as any)._innerValue).toEqual(undefined);

      fleuve$.next();
      expect((forked$ as any)._isStarted).toEqual(false);
      expect((forked$ as any)._innerValue).toEqual(undefined);
    });

    test('should emit origin value', () => {
      forked$ = fleuve$.fork();
      forked$.subscribe((x) => expect(x).toEqual(100));
      fleuve$.next(100);
    });

    test('should filter emitted values', () => {
      forked$ = fleuve$.fork(filter((x) => x > 20));
      forked$.subscribe((x) => x <= 20 ? fail('No value <= 20 should have been emitted') : void 0);
      
      fleuve$.next(10);
      expect((forked$ as any)._isStarted).toEqual(false);
      expect((forked$ as any)._innerValue).toEqual(undefined);

      fleuve$.next(30);
      expect((forked$ as any)._isStarted).toEqual(true);
      expect((forked$ as any)._innerValue).toEqual(30);
    });

    test('should map emitted values', () => {
      forked$ = fleuve$.fork(map((x) => x  * 2), map((x) => x + 5));
      forked$.subscribe((x) => expect(x).toEqual(25));
      fleuve$.next(10);
    });

    test('should throw an error', () => {
      const thresholdError = new Error('Threshold error: value is > 100');
      forked$ = fleuve$.fork(map(x => {
        if (x < 100) {
          return x;
        } else {
          throw thresholdError;
        }
      }));

      try {
        fleuve$.next(100);
        fail('The following error should have been thrown, but was not:', thresholdError);
      } catch (err) {
        expect(err).toEqual(thresholdError);
      }

    });
  });

  describe("addEventListener", () => {
    test('should throw an error', () => {
      const querySelectorSpy = jest.spyOn(document, 'querySelector').mockReturnValue(null);
      try {
        const fleuve$ = new Fleuve();
        fleuve$.addEventListener('', '', () => {});
        fail('An error should have been thrown, but is was not');
      } catch (err) {
        expect(err).toEqual(new Error(`Could not find any element with selector ""`));
      }
    });

    test('should call element.addEventListener', () => {
      const dummyAddEventListener = jest.fn();
      const dummyElem: Element = {addEventListener: dummyAddEventListener} as any;
      jest.spyOn(document, 'querySelector').mockReturnValue(dummyElem);
      const fleuve$ = new Fleuve();
      fleuve$.addEventListener('test', 'click', () => {});
      expect(dummyAddEventListener).toHaveBeenCalledWith('click', expect.any(Function), undefined);
    });

    test('should call fleuve._createEventListenerFromListener', () => {
      jest.spyOn(document, 'querySelector').mockReturnValue({addEventListener: jest.fn()} as any);
      const fleuve$ = new Fleuve();
      const _createEventListenerFromListenerSpy = jest.spyOn((fleuve$ as any), '_createEventListenerFromListener');
      const listener: Listener = jest.fn();
      fleuve$.addEventListener('test', 'click', listener);
      expect(_createEventListenerFromListenerSpy).toHaveBeenCalledWith(listener);
    });

    test('should return an event subscription', () => {
      const dummyAddEventListener = jest.fn();
      const dummyRemoveEventListener = jest.fn();
      const dummyElem: Element = {addEventListener: dummyAddEventListener, removeEventListener: dummyRemoveEventListener} as any;
      const dummyListener = jest.fn();
      jest.spyOn(document, 'querySelector').mockReturnValue(dummyElem);
      const fleuve$ = new Fleuve();
      const eventSubscription = fleuve$.addEventListener('test', 'click', dummyListener);
      expect(eventSubscription).toBeInstanceOf(EventSubscription);
      
      eventSubscription.unsubscribe();
      expect(dummyRemoveEventListener).toHaveBeenNthCalledWith(1, 'click', expect.any(Function));
    });
  });

  describe('_createEventListenerFromListener', () => {
    test('should return an eventListener', () =>{
      const fleuve$ = new Fleuve();
      const listener = jest.fn();
      const eventListener = (fleuve$ as any)._createEventListenerFromListener(listener);
      expect(eventListener).toBeTruthy();
      eventListener();
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });
});
