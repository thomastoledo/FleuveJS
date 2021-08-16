import { Fleuve } from '../../../fleuve/fleuve';
import { until } from '../../predicates/until';
import { map } from '../../transform/map';
import {preProcess} from './pre-process';

describe('preProcess', () => {
    it('should return a new Fleuve', () => {
        expect(preProcess()).toBeInstanceOf(Fleuve);
    });

    it('should apply the pre-processing operations every time we next', () => {
        const fleuve$ = preProcess<number>(map(x => x * 2), until(x => x >= 100));
        let i = 0;

        fleuve$.subscribe(x => (i < 100 ? expect(x).toEqual(i * 2) : expect(x).toEqual(50)));

        for(; i < 200; i++) { fleuve$.next(i); }
    });
})