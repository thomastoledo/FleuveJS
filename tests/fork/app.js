import {Observable, map, filter} from '../../bundle/observable.bundle.js';

const result = document.getElementById('results');
const obs$ = new Observable(12);
const forked$ = obs$.fork(filter(x => x > 15));
forked$.subscribe(x => result.innerText += `${x}\n`); // nothing would happen at first
obs$.next(20); // now, 20 would be printed in the browser's console