import { map } from "./map";
import { filter } from "./filter";
import { FilterError } from "../models/errors";

describe("Operators", () => {
  describe("map", () => {
    test("should return a new function to apply the mapping", () => {
      let _innerSource: any = 12;
      const mappedFct = map((x) => x * 2);
      expect(mappedFct(_innerSource)).toEqual(24);

      _innerSource = {firstname: 'John', lastname: 'DOE'};
      const fullnameFct = map(({firstname, lastname}) => `${firstname} ${lastname}`);
      expect(fullnameFct(_innerSource)).toEqual('John DOE');
    });
  });

  describe('filter', () => {
    test('should return a new function to apply the filtering', () => {
        let _innerSource: any = 11;
        const greaterThan10 = filter((x) => x > 10);
        expect(greaterThan10(_innerSource)).toEqual(_innerSource);
        _innerSource = 9;
        expect(() => greaterThan10(_innerSource)).toThrowError(new FilterError());
    });
  });
});
