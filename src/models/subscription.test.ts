import { MutableObservable } from "../observable/mutable-observable";
import { Observable } from "../observable/observable";
import { EMPTY_SUBSCRIPTION, subscriberOf, Subscription } from "./subscription";

describe('Subscription', () => {

    it('will succeed', () => expect(true).toBe(true));
    it('unsubscribe - should unsubscribe from a Observable', () => {
        const observable = new MutableObservable();
        const shouldNotBeCalled = jest.fn();
        const subscription = observable.subscribe(() => shouldNotBeCalled());
        subscription.unsubscribe();
        observable.next();
        expect(shouldNotBeCalled).not.toHaveBeenCalled();
    });

    it('should throw an error at Subscriber creation', () => {
        expect.assertions(1);
        try {
            subscriberOf(5 as any);
        } catch(err) {
            expect(err).toEqual(new Error(`Please provide functions for next, error and complete`));
        }
    });

    it('should be an empty Subscription', () => {
        const emptySub = new Subscription();
        expect(EMPTY_SUBSCRIPTION).toEqual(emptySub);
    })
});