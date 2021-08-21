import {tap} from './tap';

describe('tap', () => {
    it('should return a new function that will: return an OperationResult without any flag, and execute the callback', () => {
        const todo = jest.fn();
        const tapped = tap((x) => todo(x));
        const operationResult = tapped(12);
        expect(operationResult.value).toEqual(12);
        expect(operationResult.flag).toEqual(undefined);
        expect(todo).toHaveBeenNthCalledWith(1, 12);
    });
});