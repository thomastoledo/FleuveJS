import { post } from "./post";
import fetchMock from "jest-fetch-mock";

describe("http.post", () => {
  fetchMock.enableMocks();
  beforeEach(() => {
    (fetch as any).resetMocks();
  });
  it("should return a PromiseObservable with a resolved promise", (done) => {
    (fetch as any).mockResponseOnce(JSON.stringify({ products: [] }));
    post("toto.com", "json").subscribe((x) => {
      expect(x).toEqual({ products: [] });
      done();
    });
  });

  it("should return a PromiseObservable with a resolved promise JSON", (done) => {
    (fetch as any).mockResponseOnce(JSON.stringify({ products: [] }));
    post("toto.com").subscribe((x) => {
      expect(x).toEqual({ products: [] });
      done();
    });
  });

  it("should return a PromiseObservable with a rejected promise", (done) => {
    (fetch as any).mockReject(() => Promise.reject("API is down"));
    post("toto.com", "json").subscribe({
      error: (x) => {
        expect(x).toEqual("API is down");
        done();
      },
    });
  });

  it('should return a PromiseObservable with a resolve promise as text', (done) => {
    (fetch as any).mockResponseOnce(JSON.stringify({ products: [] }));
    post("toto.com", "text").subscribe((x) => {
        expect(x).toEqual(`{"products":[]}`);
        done();
      });
  });

  it('should return a PromiseObservable with a resolve promise as Blob', (done) => {
    const resObj = { products: [] };
    (fetch as any).mockResponseOnce(JSON.stringify(resObj));
    post("toto.com", "blob").subscribe(async (x: Blob) => {
        expect(await x.text()).toEqual(JSON.stringify(resObj));
        done();
      });
  });
});
