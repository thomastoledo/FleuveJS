
import fetchMock from "jest-fetch-mock";

describe('http.get', () => {

    describe('creation', () => {
        it('should return a PromiseObservable')
    });

    it('should return something', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ rates: { CAD: 1.42 } }));

        const rate = await convert("USD", "CAD");
      
        expect(rate).toEqual(1.42);
        expect(fetch).toHaveBeenCalledTimes(1);
    });
});