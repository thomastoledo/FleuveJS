import { Fleuve } from "../../fleuve/fleuve";
import { map } from "../transform/map";
import {ifElse} from './if-else';

describe('ifElse', () => {
   it('should return a new fleuve from the "if" branch', () => {
       const fleuve$ = new Fleuve(12);
       const res$ = fleuve$.pipe(ifElse((x) => x > 0, [map(x => x * 2)]));
       res$.subscribe((x) => expect(x).toEqual(24));
   });

   it('should return a new fleuve from the "else" branch', () => {
    const fleuve$ = new Fleuve(120);
    const res$ = fleuve$.pipe(ifElse((x) => x < 100, [map(x => x * 2)], [map(() => 100)]));
    res$.subscribe((x) => expect(x).toEqual(100));

    const res2$ = fleuve$.pipe(ifElse((x) => x < 100, [map(x => x * 2)]));
    res2$.subscribe((x) => expect(x).toEqual(120));
   });
});