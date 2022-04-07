import { filter } from "./filter";

describe('filter', () => {
    it('should return a new function to apply the filtering', () => {
        let _innerSource: number = 11;
        const greaterThan10 = filter((x) => x > 10);
        expect(greaterThan10(_innerSource).value).toEqual(_innerSource);
        _innerSource = 9;
        expect(greaterThan10(_innerSource).isFilterNotMatched()).toEqual(true);
    });
  });
