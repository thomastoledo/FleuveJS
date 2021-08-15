import { Fleuve } from "../../fleuve/fleuve";
import { switchMap } from "./switch-map";

describe('switchMap', () => {
    it('should return a new function to apply the switch', () => {
      let _innerSource: any = 12;
      const switchMappedFct = switchMap((x) => new Fleuve(x * 2));
      expect(switchMappedFct(_innerSource).value).toEqual(new Fleuve(24));
      expect(switchMappedFct(_innerSource).isUnwrapSwitch()).toEqual(true);

      _innerSource = {firstname: 'John', lastname: 'DOE'};
      const fullnameFct = switchMap(({firstname, lastname}) => new Fleuve(`${firstname} ${lastname}`));
      expect(fullnameFct(_innerSource).value).toEqual(new Fleuve('John DOE'));
      expect(switchMappedFct(_innerSource).isUnwrapSwitch()).toEqual(true);
    });
  });