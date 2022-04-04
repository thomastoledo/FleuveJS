import { map } from "../../transform/map";
import { fork } from "./fork";
import { mutable } from "./mutable";
import {of} from './of';

describe('fork', () => {
    it('will succeed', () => expect(true).toBe(true));

    it('should create an observable fork from an Observable', () => {
        const obs$ = fork(of(12, 13), map(x => x * 2));
        const spy = jest.fn();
        obs$.subscribe({complete: () => spy()});
        expect(spy).toHaveBeenCalled();
    });

    it('should create an observable fork from a MutableObservable', () => {
        const obs$ = fork(mutable(12, 13), map(x => x * 2));
        const completeSpy = jest.fn();
        const nextSpy = jest.fn();
        obs$.subscribe({next: (x) => nextSpy(x), complete: () => completeSpy()});
        expect(completeSpy).not.toHaveBeenCalled();
        expect(nextSpy).toBeCalledTimes(2);
    });
});