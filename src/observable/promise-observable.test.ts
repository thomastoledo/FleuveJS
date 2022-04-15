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
    
    it("should create a new PromiseObservable with a rejected value", async () => {
      const obs$ = new PromiseObservable<number>(Promise.reject(new Error('rejected')));
      const errorCallback = jest.fn((err) => {
        console.log('SALUT LES GARS')
        expect(err).toEqual(new Error('rejected'))
      });
      obs$.subscribe({
        next: () => fail(`Next callback should not have been called`),
        error: errorCallback
      });

      console.log('OUI')
      expect(errorCallback).toHaveBeenNthCalledWith(1, new Error('rejected'));
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
