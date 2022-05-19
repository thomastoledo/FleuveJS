import { fail } from "../helpers/function.helper";
import { Subscriber, subscriberOf, OnNext } from "../models";
import { map } from "../operators";
import { PromiseObservable } from "./promise-observable";

describe("PromiseObservable", () => {
  describe('creation', () => {
    it("should create a new PromiseObservable with a resolved value", () => {
      const obs$ = new PromiseObservable<number>(Promise.resolve(0));
      obs$.subscribe({
        next: (value) => expect(value).toEqual(0),
      });
    });
    
    it("should create a new PromiseObservable with a rejected value", (done) => {
      const obs$ = new PromiseObservable<number>(Promise.reject(new Error('rejected')));
      expect.assertions(1);
      const errorCallback = jest.fn((err) => {
        expect(err).toEqual(new Error('rejected'));
        done();
      });
      
      obs$.subscribe({
        next: () => fail(`Next callback should not have been called`),
        error: errorCallback
      });
    });
  });

  describe('pipe', () => {
    it("should create a new PromiseObservable with a resolved value", async () => {
      const obs$ = new PromiseObservable<number>(Promise.resolve(0)).pipe(map((value) => value + 12));
      obs$.subscribe({
        next: (value) => expect(value).toEqual(12),
      });
    });
  });

  describe('subscribe', () => {
    it("should throw an error", () => {
      const obs$ = new PromiseObservable<number>(Promise.resolve(0));
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
      const obs$ = new PromiseObservable<number>(Promise.resolve(0));
      expect((obs$ as any)._subscribers.length).toEqual(0);
      obs$.subscribe(() => {});
      expect((obs$ as any)._subscribers.length).toEqual(1);
    });

    it("should not execute the subscriber", () => {
      const subscriber: Subscriber = subscriberOf(jest.fn());
      const obs$ = new PromiseObservable(Promise.reject('nope'));
      obs$.subscribe(subscriber);
      expect(subscriber.next).not.toHaveBeenCalled();
    });

    it("should execute onComplete", (done) => {
      const obs$ = new PromiseObservable(Promise.resolve(12));
      obs$.subscribe({ next: jest.fn(), complete: () => done() });
    });

    it('should return a new subscription', () => {
      const obs$ = new PromiseObservable(Promise.resolve(12));
      const sub = obs$.subscribe(jest.fn());
      const spySub = jest.spyOn((sub as any), '_unsubscribeCallback');
      sub.unsubscribe();
      expect(spySub).toHaveBeenCalledTimes(1);
    });
  });
});
