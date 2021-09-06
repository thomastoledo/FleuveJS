import { EventSubscription, Listener } from "../models/event";
import { subscriberOf, OnNext, Subscriber } from "../models/subscription";
import { filter } from "../operators/predicates/filter";
import { map } from "../operators/transform/map";
import { switchMap } from "../operators/transform/switch-map";
import { Observable } from "./observable";

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
    expect((obs$ as any)._innerSequence).toEqual([]);
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
    });

    it("should execute onNext", () => {
      const onNext: OnNext<number> = jest.fn();
      const obs$ = new Observable<number>(12);
      obs$.subscribe(onNext);
      expect(onNext).toHaveBeenNthCalledWith(1, 12);
    });

    it('should execute onComplete', (done) => {
      const obs$ = new Observable(12);
      obs$.subscribe({next: jest.fn(), complete: () => done()});
    });
  });

  describe("pipe", () => {
    it("should return a new Observable with no value", () => {
      const obs$ = new Observable<number>();
      const pipedobs$ = obs$.pipe(map((value: number) => value * 2));
      expect((pipedobs$ as any)._innerSequence).toEqual([]);
      pipedobs$.subscribe(() => {
        fail("Should not go there, Observable should not have been started");
      });
    });

    it("should return a new Observable with the original Observable's value", () => {
      const obs$ = new Observable(12);
      const pipedobs$ = obs$.pipe();

      pipedobs$.subscribe((value) => {
        expect(value).toEqual(12);
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
      expect((filteredobs$ as any)._innerSequence).toEqual([]);
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

  describe("addEventListener", () => {
    it("should throw an error", () => {
      jest.spyOn(document, "querySelector").mockReturnValue(null);
      expect.assertions(1);
      try {
        const obs$ = new Observable();
        obs$.addEventListener("", "click", () => {});
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
      const obs$ = new Observable(12);
      const listener = jest.fn();
      const eventListener = (obs$ as any)._createEventListenerFromListener(
        listener
      );
      expect(eventListener).toBeTruthy();
      eventListener();
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it("should return an eventListener but never call it", () => {
      const obs$ = new Observable(12);
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
});
