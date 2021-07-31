import { Fleuve } from "../fleuve";

describe('Subscription', () => {
    it('unsubscribe - should unsubscribe from a Fleuve', () => {
        const fleuve = new Fleuve();
        const shouldNotBeCalled = jest.fn();
        const subscription = fleuve.subscribe(() => shouldNotBeCalled());
        subscription.unsubscribe();
        fleuve.next();
        expect(shouldNotBeCalled).not.toHaveBeenCalled();
    });
});