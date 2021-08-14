import { StopFleuveSignal } from "../../models/errors";
import { until } from "./until";

describe('until', () => {
    it('should return a new function that will execute until the predicate is reached', async () => {
        const untilGreaterThan10 = until((x) => x > 10);
        let i = 0;
        for (; i < 11; i++) {
            await expect(untilGreaterThan10(i)).resolves.toEqual(i);
        }
        await expect(untilGreaterThan10(i)).rejects.toEqual(new StopFleuveSignal());
        await expect(untilGreaterThan10(0)).rejects.toEqual(new StopFleuveSignal());
    });
  });
