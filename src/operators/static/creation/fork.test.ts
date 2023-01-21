import { map } from "../../transform/map";
import { switchMap } from "../../transform/switch-map";
import { fork } from "./fork";
import { mutable } from "./mutable";
import { of } from "./of";

describe("fork", () => {
  it("will succeed", () => expect(true).toBe(true));

  it("should create an observable fork from an Observable", () => {
    const obs$ = fork(
      of(12, 13),
      map((x) => x * 2)
    );
    const spy = jest.fn();
    obs$.subscribe({ complete: () => spy() });
    expect(spy).toHaveBeenCalled();
  });

  it("should create an observable fork from a MutableObservable", () => {
    const obs$ = fork(
      mutable(12, 13),
      map((x) => x * 2)
    );
    const completeSpy = jest.fn();
    const nextSpy = jest.fn();
    obs$.subscribe({ next: (x) => nextSpy(x), complete: () => completeSpy() });
    expect(completeSpy).not.toHaveBeenCalled();
    expect(nextSpy).toBeCalledTimes(2);
  });

  it("should replace an observable by another with the switchMap operator", () => {
    const obs$ = fork(
      mutable(12, 13),
      switchMap(() => mutable("toto"))
    );
    const completeSpy = jest.fn();
    const nextSpy = jest.fn();
    obs$.subscribe({ next: (x) => nextSpy(x), complete: () => completeSpy() });
    expect(completeSpy).not.toHaveBeenCalled();
    expect(nextSpy).toHaveBeenCalledWith("toto");
  });

  describe("should take a mutable observable, and replace it by a fork observable", () => {
    const filterState$ = mutable<{
      fromDate: Date | null;
      toDate: Date | null;
    }>({
      fromDate: null,
      toDate: null,
    });

    const budgetState$ = mutable<{ expenses: number[]; incomes: number[] }>({
      expenses: [],
      incomes: [],
    });

    it("fork the budgetState$ and receive its sequence", () => {
      const completeSpy = jest.fn();
      const nextSpy = jest.fn();

      const forkBudget$ = fork<{ expenses: number[]; incomes: number[] }>(
        budgetState$
      );

      const budgetSub = forkBudget$.subscribe({
        next: nextSpy,
        complete: completeSpy,
      });
      expect(completeSpy).not.toHaveBeenCalled();
      expect(nextSpy).toHaveBeenCalledWith({ expenses: [], incomes: [] });
      budgetSub.unsubscribe();
    });

    it("should fork the filterState$ and receive the budgetState$ sequence", () => {
      const completeSpy = jest.fn();
      const nextSpy = jest.fn();

      const fork$ = fork(
        filterState$,
        switchMap(() => budgetState$)
      );
      const forkSub = fork$.subscribe({
        next: (state) => {
          nextSpy(state);
        },
        complete: () => completeSpy(),
      });

      budgetState$.compile(
        map((state) => ({
          ...state,
          expenses: [120],
          incomes: [140],
        }))
      );

      filterState$.compile(
        map(() => ({
          fromDate: new Date(),
          toDate: null,
        }))
      );

      expect(nextSpy).toHaveBeenCalledWith({ expenses: [120], incomes: [140] });
      forkSub.unsubscribe();
    });

    it("should fork the filterState$ and receive the budgetState$ sequence again", () => {
      const completeSpy = jest.fn();
      const nextSpy = jest.fn();

      const forkBudget$ = fork<{ expenses: number[]; incomes: number[] }>(
        budgetState$
      );

      budgetState$.compile(
        map((state) => ({
          ...state,
          expenses: [],
          incomes: [],
        }))
      );
      const fork$ = fork(
        filterState$,
        switchMap(() => forkBudget$)
      );

      fork$.subscribe({
        next: (state) => {
          nextSpy(state);
        },
        complete: () => completeSpy(),
      });
      expect(completeSpy).not.toHaveBeenCalled();
      expect(nextSpy).toHaveBeenCalledWith({ expenses: [], incomes: [] });

      budgetState$.compile(
        map(() => ({
          expenses: [120],
          incomes: [140],
        }))
      );

      filterState$.compile(
        map(() => ({
          fromDate: new Date(),
          toDate: null,
        }))
      );

      expect(nextSpy).toHaveBeenCalledWith({ expenses: [120], incomes: [140] });
    });
  });
});
