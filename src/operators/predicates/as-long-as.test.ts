import { StopFleuveSignal } from "../../models/errors";
import { asLongAs } from "./as-long-as";

describe('asLongAs', () => {
    it('should return a new function that will execute as long as the predicate is matched', async () => {
        const asLongAsGreaterThan0 = asLongAs((x) => x > 0);
        let i = 10;
        for (; i > 0; i--) {
            await expect(asLongAsGreaterThan0(i)).resolves.toEqual(i);
        }
        await expect(asLongAsGreaterThan0(i)).rejects.toEqual(new StopFleuveSignal());
        await expect(asLongAsGreaterThan0(1)).rejects.toEqual(new StopFleuveSignal());
    });

    it('should reject an error', async () => {
        const error = asLongAs((x) => {
            if (x <= 0) {
                throw new Error('Lesser than 0');
            }
            return true;
        });

        await expect(error(0)).rejects.toEqual(new Error('Lesser than 0'));
    });
  });
