import {mutableFrom} from './mutable-from';

describe('mutableFrom', () => {
    it('will succeed', () => expect(true).toBe(true));

    it('should create a new MutableObservable', () => {
        const obs$ = mutableFrom([12]);
        const spy = jest.fn();
        obs$.subscribe({next: (x) => expect(x).toEqual(12), complete: () => spy()});
        expect(spy).not.toHaveBeenCalled();
    });
});