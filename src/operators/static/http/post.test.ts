import { post } from "./post";
import fetchMock from "jest-fetch-mock";

describe("http.post", () => {
  fetchMock.enableMocks();
  beforeEach(() => {
    (fetch as any).resetMocks();
  });
  it("should return a PromiseObservable with a resolved promise", (done) => {
    const newProduct = {id: '1', name: 'product1'};
    const expectedResult = {products: [newProduct]};
    (fetch as any).mockResponseOnce(JSON.stringify(expectedResult));

    post("toto.com", "json", {body: JSON.stringify(newProduct)}).subscribe((x) => {
      expect(x).toEqual(expectedResult);
      done();
    });
  });

  it("should return a PromiseObservable with a rejected promise", (done) => {
    (fetch as any).mockReject(() => Promise.reject("API is down"));
    post("toto.com", "json", {}).subscribe({
      error: (x) => {
        expect(x).toEqual("API is down");
        done();
      },
    });
  });

  it('should return a PromiseObservable with a resolve promise as text', (done) => {
    const newProduct = {id: '1', name: 'product1'};
    const expectedResult = {products: [newProduct]};
    (fetch as any).mockResponseOnce(JSON.stringify(expectedResult));
    post("toto.com", "text", {body: JSON.stringify(newProduct)}).subscribe((x) => {
        expect(x).toEqual(JSON.stringify(expectedResult));
        done();
      });
  });

  it('should return a PromiseObservable with a resolve promise as Blob', (done) => {
    const newProduct = {id: '1', name: 'product1'};
    const expectedResult = {products: [newProduct]};
    (fetch as any).mockResponseOnce(JSON.stringify(expectedResult));
    post("toto.com", "blob", {body: JSON.stringify(newProduct)}).subscribe(async (x: Blob) => {
        expect(await x.text()).toEqual(JSON.stringify(expectedResult));
        done();
      });
  });
});
