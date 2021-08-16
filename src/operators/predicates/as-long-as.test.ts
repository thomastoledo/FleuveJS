import { asLongAs } from "./as-long-as";

describe('asLongAs', () => {
    it('should return a new function that will execute as long as the predicate is matched', () => {
        const asLongAsGreaterThan0 = asLongAs((x) => x > 0);
        let i = 10;
        for (; i > 0; i--) {
            expect(asLongAsGreaterThan0(i).value).toEqual(i);
        }
        expect(asLongAsGreaterThan0(i).isMustStop()).toEqual(true);
        expect(asLongAsGreaterThan0(1).isMustStop()).toEqual(true);
    });
  });
