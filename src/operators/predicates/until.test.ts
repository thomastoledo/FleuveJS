import { until } from "./until";

describe('until', () => {
    it('should return a new function that will execute until the predicate is reached', () => {
        const untilGreaterThan10 = until((x) => x > 10);
        let i = 0;
        for (; i < 11; i++) {
            expect(untilGreaterThan10(i).value).toEqual(i);
        }
        expect(untilGreaterThan10(i).isMustStop()).toEqual(true);
        expect(untilGreaterThan10(0).isMustStop()).toEqual(true);
    });
  });
