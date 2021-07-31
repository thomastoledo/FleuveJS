import { map } from "./map";
import { filter } from "./filter";
import { switchMap } from "./switch-map";
import { FilterError } from "../models/errors";
import { Fleuve } from "../fleuve";

describe("Operators", () => {
  describe("map", () => {
    it("should return a new function to apply the mapping", async () => {
      let _innerSource: any = 12;
      const mappedFct = map((x) => x * 2);
      expect(await mappedFct(_innerSource)).toEqual(24);

      _innerSource = {firstname: 'John', lastname: 'DOE'};
      const fullnameFct = map(({firstname, lastname}) => `${firstname} ${lastname}`);
      expect(await fullnameFct(_innerSource)).toEqual('John DOE');
    });
  });

  describe('filter', () => {
    it('should return a new function to apply the filtering', async () => {
        let _innerSource: any = 11;
        const greaterThan10 = filter((x) => x > 10);
        await expect(greaterThan10(_innerSource)).resolves.toEqual(_innerSource);
        _innerSource = 9;
        await expect(greaterThan10(_innerSource)).rejects.toEqual(new FilterError());
    });
  });

  describe('switchMap', () => {
    it('should return a new function to apply the switch', async () => {
      let _innerSource: any = 12;
      const switchMappedFct = switchMap((x) => new Fleuve(x * 2));
      expect(await switchMappedFct(_innerSource)).toEqual(24);

      _innerSource = {firstname: 'John', lastname: 'DOE'};
      const fullnameFct = switchMap(({firstname, lastname}) => new Fleuve(`${firstname} ${lastname}`));
      expect(await fullnameFct(_innerSource)).toEqual('John DOE');
    });
  })
});
