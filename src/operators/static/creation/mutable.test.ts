import {mutable} from './mutable';
import { fail } from "../../../helpers/function.helper";

describe('mutable', () => {
    it('will succeed', () => expect(true).toBe(true));

    it('should create a new MutableObservable', () => {
        const obs$ = mutable(12);
        obs$.subscribe({next: (x) => expect(x).toEqual(12), complete: () => fail(`MutableObservable should not be complete`)});
    });
});