import { map } from "./map";

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
});
