import {of} from './of';

describe('of', () => {
    it('will succeed', () => expect(true).toBe(true));

    it('should create a new Observable', () => {
        const obs$ = of(12);
        const spy = jest.fn();
        obs$.subscribe({next: (x) => expect(x).toEqual(12), complete: () => spy()});
        expect(spy).toHaveBeenCalledTimes(1);
    });
});