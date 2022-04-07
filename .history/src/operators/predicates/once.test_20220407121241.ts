import { fork, of } from "../static";
import {once} from './once';
import { subscriberOf } from '../../models/subscription';
import { mutable } from '../static/creation/mutable';

describe("once", () => {
  describe("without predicate", () => {
    it("should only take the first value of an Observable", () => {
      const obs$ = of(12, 13, 14).pipe(once());
      const completeCb = jest.fn();
      obs$.subscribe(subscriberOf((x) => expect(x).toEqual(12), void 0, completeCb));
      expect(completeCb).toHaveBeenCalledTimes(1);
    });

    it("should only take the first value of a MutableObservable", () => {
        const mut$ = mutable(12, 13, 14);
        const completeCb = jest.fn();
        mut$.compile(once()).subscribe(subscriberOf((x) => expect(x).toEqual(12), void 0, completeCb));
        expect(completeCb).toHaveBeenCalledTimes(1);
      });

      it("should only take the first value of an ObservableFork", () => {
        const fork$ = fork(of(12, 13, 14), once());
        const completeCb = jest.fn();
        fork$.subscribe(subscriberOf((x) => expect(x).toEqual(12), void 0, completeCb));
        expect(completeCb).toHaveBeenCalledTimes(1);
      });
  });

  describe('with predicate', () => {
    it("should only take the first value of an Observable and complete it", () => {
        const obs$ = of(12, 13, 14).pipe(once((x) => x === 13));
        const completeCb = jest.fn();
        obs$.subscribe(subscriberOf((x) => expect(x).toEqual(13), void 0, completeCb));
        expect(completeCb).toHaveBeenCalledTimes(1);
      });
  
      it("should only take the first value of a MutableObservable", () => {
          const mut$ = mutable(12, 13, 14);
          const completeCb = jest.fn();
          mut$.compile(once((x) => x > 13)).subscribe(subscriberOf((x) => expect(x).toEqual(14), void 0, completeCb));
          expect(completeCb).not.toHaveBeenCalled();
        });
  
        it("should only take the first value of an ObservableFork", () => {
          const fork$ = fork(of(12, 13, 14), once((x) => x < 13));
          const completeCb = jest.fn();
          fork$.subscribe(subscriberOf((x) => expect(x).toEqual(12), void 0, completeCb));
          expect(completeCb).toHaveBeenCalledTimes(1);
        });
  });
});
