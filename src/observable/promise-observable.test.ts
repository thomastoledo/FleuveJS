import { PromiseObservable } from "./promise-observable";

describe("PromiseObservable", () => {
  it("should create a new PromiseObservable with a resolved value", () => {
    const obs$ = new PromiseObservable<number>(Promise.resolve(0));
    obs$.subscribe({
      next: (value) => expect(value).toEqual(10),
    });
  });
});
