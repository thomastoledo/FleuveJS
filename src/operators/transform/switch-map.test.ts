import { Observable } from "../../observable/observable";
import { switchMap } from "./switch-map";

describe('switchMap', () => {
    it('should return a new function to apply the switch', () => {
      let _innerSource: any = 12;
      const switchMappedFct = switchMap((x) => new Observable(x * 2));
      expect(switchMappedFct(_innerSource).value).toEqual(new Observable(24));
      expect(switchMappedFct(_innerSource).isUnwrapSwitch()).toEqual(true);

      _innerSource = {firstname: 'John', lastname: 'DOE'};
      const fullnameFct = switchMap(({firstname, lastname}) => new Observable(`${firstname} ${lastname}`));
      expect(fullnameFct(_innerSource).value).toEqual(new Observable('John DOE'));
      expect(switchMappedFct(_innerSource).isUnwrapSwitch()).toEqual(true);
    });
  });