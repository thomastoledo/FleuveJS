import { fail } from "../helpers/function.helper";
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
      const obs$ = new PromiseObservable<number>(Promise.resolve(0));
      obs$.subscribe({
        next: (value) => expect(value).toEqual(0),
      });
    });
  });
});
