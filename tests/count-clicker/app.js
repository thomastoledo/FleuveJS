import { MutableObservable } from '../../bundle/observable.bundle.js';

const counter$ = new MutableObservable(0);
const counter = document.getElementById('counter');

counter$.subscribe((count) => {
    counter.innerText = count;
});

counter$.addEventListener('#increment', 'click', (x) => counter$.next(x + 1));
counter$.addEventListener('#decrement', 'click', (x) => counter$.next(x - 1));