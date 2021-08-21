import {of} from './of';

describe('of', () => {
    it('should create a new Fleuve', () => {
        const fleuve$ = of(12);
        const spy = jest.fn();
        fleuve$.subscribe({next: (x) => expect(x).toEqual(12), complete: () => spy()});
        expect(spy).toHaveBeenCalledTimes(1);
    });
});