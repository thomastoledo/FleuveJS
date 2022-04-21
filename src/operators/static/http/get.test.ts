import { get } from "./get";
import fetchMock from "jest-fetch-mock";

describe("http.get", () => {
  fetchMock.enableMocks();
  beforeEach(() => {
    (fetch as any).resetMocks();
  });
  it("should return a PromiseObservable with a resolved promise", (done) => {
    (fetch as any).mockResponseOnce(JSON.stringify({ products: [] }));
    get("toto.com", "json").subscribe((x) => {
      expect(x).toEqual({ products: [] });
      done();
    });
  });

  it("should return a PromiseObservable with a rejected promise", (done) => {
    (fetch as any).mockReject(() => Promise.reject("API is down"));
    get("toto.com", "json").subscribe({
      error: (x) => {
        expect(x).toEqual("API is down");
        done();
      },
    });
  });

  it('should return a PromiseObservable with a resolve promise as text', (done) => {
    (fetch as any).mockResponseOnce(JSON.stringify({ products: [] }));
    
  });
});
