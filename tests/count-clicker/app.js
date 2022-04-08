import { mutable, map } from '../../bundle/observable.bundle.js';

const counter$ = mutable(0);
const counter = document.getElementById('counter');

counter$.subscribe((count) => { counter.innerText = count;});
document.getElementById('increment').addEventListener('click', () => counter$.compile(map(x => x + 1)));
document.getElementById('decrement').addEventListener('click', () => counter$.compile(map(x => x - 1)));