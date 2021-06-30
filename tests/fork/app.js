import {Fleuve, map, filter} from '../../bundle/fleuve.bundle.js';

const result = document.getElementById('results');
const fleuve$ = new Fleuve(12);
const forked$ = fleuve$.fork(filter(x => x > 15));
forked$.subscribe(x => result.innerText += `${x}\n`); // nothing would happen at first
fleuve$.next(20); // now, 20 would be printed in the browser's console