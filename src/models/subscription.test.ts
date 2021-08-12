import { Fleuve } from "../fleuve/fleuve";
import { Subscriber, Subscription } from "./subscription";

describe('Subscription', () => {
    it('unsubscribe - should unsubscribe from a Fleuve', () => {
        const fleuve = new Fleuve();
        const shouldNotBeCalled = jest.fn();
        const subscription = fleuve.subscribe(() => shouldNotBeCalled());
        subscription.unsubscribe();
        fleuve.next();
        expect(shouldNotBeCalled).not.toHaveBeenCalled();
    });

    it('should throw an error at Subscriber creation', () => {
        expect.assertions(1);
        try {
            Subscriber.of(5 as any);
        } catch(err) {
            expect(err).toEqual(new Error(`Please provide functions for onNext, onError and onComplete`));
        }
    });
});