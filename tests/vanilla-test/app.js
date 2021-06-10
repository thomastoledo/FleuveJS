import { Fleuve } from 'https://unpkg.com/fleuvejs@latest/index.js';


const counter$ = new Fleuve(0);
const counter = document.getElementById('counter');
counter$.subscribe((count) => {
    counter.innerText = count;
});

document.getElementById('increment').addEventListener('click', () => counter$.next((x) => x + 1));
document.getElementById('decrement').addEventListener('click', () => counter$.next((x) => x - 1));