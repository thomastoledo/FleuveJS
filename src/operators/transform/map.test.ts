import { map } from "./map";

describe("Operators", () => {

  describe("map", () => {
    it("should return a new function to apply the mapping", () => {
      let _innerSource: any = 12;
      const mappedFct = map((x) => x * 2);
      expect(mappedFct(_innerSource).value).toEqual(24);

      _innerSource = {firstname: 'John', lastname: 'DOE'};
      const fullnameFct = map(({firstname, lastname}) => `${firstname} ${lastname}`);
      expect(fullnameFct(_innerSource).value).toEqual('John DOE');
    });
  });
});
