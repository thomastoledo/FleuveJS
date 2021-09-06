import {of} from './of';

describe('of', () => {
    it('should create a new Observable', () => {
        const obs$ = of(12);
        const spy = jest.fn();
        obs$.subscribe({next: (x) => expect(x).toEqual(12), complete: () => spy()});
        expect(spy).toHaveBeenCalledTimes(1);
    });
});