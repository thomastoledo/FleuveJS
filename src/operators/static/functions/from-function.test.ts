import {fromFunction} from './from-function';
import {map} from '../../transform'

describe('fromFunction', () => {
    it('should return a callable function to which you can subscribe', () => {
        function sum(...args: number[]) {
            return args.reduce((acc, curr) => acc + curr, 0);
        }

        const sum$ = fromFunction(sum);
        const next = jest.fn((res) => expect(res).toBe(4));
        sum$.subscribe(next);
        sum$(2, 2);
        expect(next).toHaveBeenNthCalledWith(1, 4);
    });

    it('should return a piped Observable', () => {
        function sum(...args: number[]) {
            return args.reduce((acc, curr) => acc + curr, 0);
        }

        const sum$ = fromFunction(sum).pipe(map((x) => x * 2));
    });
})

