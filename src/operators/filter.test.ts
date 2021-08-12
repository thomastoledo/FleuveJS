import { FilterError } from "../models/errors";
import { filter } from "./filter";

describe('filter', () => {
    it('should return a new function to apply the filtering', async () => {
        let _innerSource: any = 11;
        const greaterThan10 = filter((x) => x > 10);
        await expect(greaterThan10(_innerSource)).resolves.toEqual(_innerSource);
        _innerSource = 9;
        await expect(greaterThan10(_innerSource)).rejects.toEqual(new FilterError());
    });
  });
