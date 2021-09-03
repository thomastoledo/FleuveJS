import { Observable } from "../observable/observable";
import { subscriberOf } from "./subscription";

describe('Subscription', () => {
    it('unsubscribe - should unsubscribe from a Observable', () => {
        const observable = new Observable();
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
            expect(err).toEqual(new Error(`Please provide functions for onNext, onError and onComplete`));
        }
    });
});