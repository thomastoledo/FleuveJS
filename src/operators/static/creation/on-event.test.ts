import {onEvent} from './on-event';

describe('onEvent', () => {
    it('should return a new Observable', () => {
        const button = document.createElement('button');
        button.id = 'test';

        document.body.appendChild(button);
        const obs$ = onEvent(button, 'click');
        obs$.subscribe((event) => {expect(event).toBeTruthy()});
        button.click();
    });
});