import { put } from "./put";
import fetchMock from "jest-fetch-mock";

describe("http.put", () => {
  fetchMock.enableMocks();
  beforeEach(() => {
    (fetch as any).resetMocks();
  });
  it("should return a PromiseObservable with a resolved promise", (done) => {
    const newProduct = { id: "1", name: "product1" };
    const expectedResult = { products: [newProduct] };
    (fetch as any).mockResponseOnce(JSON.stringify(expectedResult));

    put("toto.com", {
      body: JSON.stringify(newProduct),
      type: "json",
    }).subscribe((x) => {
      expect(x).toEqual(expectedResult);
      done();
    });
  });

  it("should return a PromiseObservable with a rejected promise", (done) => {
    (fetch as any).mockReject(() => Promise.reject("API is down"));
    put("toto.com", { type: "json" }).subscribe({
      error: (x) => {
        expect(x).toEqual("API is down");
        done();
      },
    });
  });

  it("should return a PromiseObservable with a resolved promise JSON", (done) => {
    (fetch as any).mockResponseOnce(JSON.stringify({ products: [] }));
    put("toto.com", { type: "json" }).subscribe((x) => {
      expect(x).toEqual({ products: [] });
      done();
    });
  });

  it("should return a PromiseObservable with a resolved promise as text", (done) => {
    const newProduct = { id: "1", name: "product1" };
    const expectedResult = { products: [newProduct] };
    (fetch as any).mockResponseOnce(JSON.stringify(expectedResult));
    put("toto.com", {
      body: JSON.stringify(newProduct),
      type: "text",
    }).subscribe((x) => {
      expect(x).toEqual(JSON.stringify(expectedResult));
      done();
    });
  });

  it("should return a PromiseObservable with a resolve promise as Blob", (done) => {
    const newProduct = { id: "1", name: "product1" };
    const expectedResult = { products: [newProduct] };
    (fetch as any).mockResponseOnce(JSON.stringify(expectedResult));
    put("toto.com", {
      body: JSON.stringify(newProduct),
      type: "blob",
    }).subscribe(async (x: Blob) => {
      expect(await x.text()).toEqual(JSON.stringify(expectedResult));
      done();
    });
  });
});
