import { Fleuve } from "../../fleuve/fleuve";
import { switchMap } from "./switch-map";

describe('switchMap', () => {
    it('should return a new function to apply the switch', async () => {
      let _innerSource: any = 12;
      const switchMappedFct = switchMap((x) => new Fleuve(x * 2));
      expect(await switchMappedFct(_innerSource)).toEqual(24);

      _innerSource = {firstname: 'John', lastname: 'DOE'};
      const fullnameFct = switchMap(({firstname, lastname}) => new Fleuve(`${firstname} ${lastname}`));
      expect(await fullnameFct(_innerSource)).toEqual('John DOE');
    });
  });