import { Observable } from "../../observable/observable";
import { mutable, of } from "../static";
import { map } from "../transform";
import { withLatestFrom } from "./with-latest-from";
describe("withLatestFrom", () => {
  it("will succeed", () => expect(true).toBe(true));

  it("should return a new function to apply the withLatestFrom", () => {
    let _innerSource: any = 12;
    const withLatesFromFct = withLatestFrom();
    expect(withLatesFromFct(_innerSource).value).toEqual([12]);
    expect(withLatesFromFct(_innerSource).isFilterNotMatched()).toEqual(false);
  });

  it("should not emit", () => {
    const obs$ = of(12);
    const pipedobs$ = obs$.pipe(withLatestFrom(of()));
    const nextSpy = jest.fn();
    pipedobs$.subscribe({ next: nextSpy });
    expect(nextSpy).not.toHaveBeenCalled();
  });

  it("should emit b1, c4, d4", () => {
    const source1$ = mutable<string>("a");
    const source2$ = mutable<number>();
    const withLatestFrom$ = source1$.pipe(
      withLatestFrom(source2$, source1$),
      map(([source1, source2]) => `${source1}${source2}`),
    );
    const nextSpy = jest.fn();

    withLatestFrom$.subscribe({ next: nextSpy });
    expect(nextSpy).not.toHaveBeenCalled();

    source1$.next("b");
    source2$.next(1); 
    expect(nextSpy).toHaveBeenCalledWith("b1");
    source2$.next(2); 
    expect(nextSpy).not.toHaveBeenCalledWith('b2');
    source2$.next(3); 
    expect(nextSpy).not.toHaveBeenCalledWith('b3');
    source2$.next(4); 
    expect(nextSpy).not.toHaveBeenCalledWith('b4');

    source1$.next('c');
    expect(nextSpy).toHaveBeenCalledWith("c4");
    source1$.next('d');
    expect(nextSpy).toHaveBeenCalledWith("d4");
  });
});
