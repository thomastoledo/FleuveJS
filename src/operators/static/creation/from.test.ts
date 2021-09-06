import {from} from './from';

describe('from', () => {
    it('should create a new Observable', () => {
        const obs$ = from([12]);
        const spy = jest.fn();
        obs$.subscribe({next: (x) => expect(x).toEqual(12), complete: () => spy()});
        expect(spy).toHaveBeenCalledTimes(1);
    });
});