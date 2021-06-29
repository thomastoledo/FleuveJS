import {Fleuve} from './fleuve';
import { filter } from './operators/filter';
import { map } from './operators/map';
describe('Fleuve', () => {
    describe('pipe', () => {
        test('should return a new Fleuve with an undefined value', () => {
            const fleuve$ = new Fleuve(12);
            const pipedFleuve$ = fleuve$.pipe();
            pipedFleuve$.subscribe((value) => {
                expect(value).toEqual(void 0);
            })
        });

        test('should return a Fleuve(6)', () => {
            const fleuve$ = new Fleuve(12);
            const mappedFleuve$ = fleuve$.pipe(map((value) => value / 2));
            mappedFleuve$.subscribe((value) => expect(value).toEqual(6));
        });

        test('should return a Fleuve(12)', () => {
            const fleuve$ = new Fleuve(12);
            const filteredFleuve$ = fleuve$.pipe(filter((value) => value > 10));
            filteredFleuve$.subscribe((value) => expect(value).toEqual(12));
        });

        test('should return a filtered Fleuve with no value', () => {
            const fleuve$ = new Fleuve(12);
            const filteredFleuve$ = fleuve$.pipe(filter((value) => value < 10));
            filteredFleuve$.subscribe((value) => expect(value).toEqual(void 0));
        });

        test('should return a Fleuve("FILTERED") and then a Fleuve(0)', () => {
            const fleuve$ = new Fleuve('FIL');
            const result$ = fleuve$.pipe(map(str => str + 'TERED'), filter(str => !!str));
            result$.subscribe(value => expect(value).toEqual('FILTERED'));

            const result2$ = (new Fleuve(1)).pipe(map(x => x - 1), filter(x => x >= 0));
            result2$.subscribe(value => expect(value).toEqual(0));
        });
    });
});