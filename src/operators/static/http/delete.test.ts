import { del } from "./delete";
import fetchMock from "jest-fetch-mock";

describe("http.del", () => {
  fetchMock.enableMocks();
  beforeEach(() => {
    (fetch as any).resetMocks();
  });
  it("should return a PromiseObservable with a resolved promise", (done) => {
    const expectedResult = { id: 1};
    (fetch as any).mockResponseOnce(JSON.stringify(expectedResult));

    del("toto.com/1", {
      type: "json",
    }).subscribe((x) => {
      expect(x).toEqual(expectedResult);
      done();
    });
  });

  it("should return a PromiseObservable with a rejected promise", (done) => {
    (fetch as any).mockReject(() => Promise.reject("API is down"));
    del("toto.com/1", { type: "json" }).subscribe({
      error: (x) => {
        expect(x).toEqual("API is down");
        done();
      },
    });
  });

  it("should return a PromiseObservable with a resolved promise JSON", (done) => {
    (fetch as any).mockResponseOnce(JSON.stringify({ id: 1 }));
    del("toto.com/1", { type: "json" }).subscribe((x) => {
      expect(x).toEqual({ id: 1 });
      done();
    });
  });

  it("should return a PromiseObservable with a resolved promise as text", (done) => {
    const expectedResult = { id: 1 };
    (fetch as any).mockResponseOnce(JSON.stringify(expectedResult));
    del("toto.com/1", {
      type: "text",
    }).subscribe((x) => {
      expect(x).toEqual(JSON.stringify(expectedResult));
      done();
    });
  });

  it("should return a PromiseObservable with a resolve promise as Blob", (done) => {
    const expectedResult = { id: 1 };
    (fetch as any).mockResponseOnce(JSON.stringify(expectedResult));
    del("toto.com/1", {
      type: "blob",
    }).subscribe(async (x: Blob) => {
      expect(await x.text()).toEqual(JSON.stringify(expectedResult));
      done();
    });
  });
});
