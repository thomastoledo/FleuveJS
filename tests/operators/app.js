import {Observable, map, filter} from '../../bundle/observable.bundle.js';


const result = document.getElementById('results');
const obs$ = new Observable(12);

obs$.pipe(map(x => x * 2)).subscribe((value) => result.innerText += `Mapped value is ${value}`);
obs$.pipe(filter(x => x > 1000)).subscribe((value) => result.innerText += `\nFiltered value is ${value}`);
obs$.pipe(map(x => x * 2), filter(x => x > 12)).subscribe((value) => result.innerText += `\nMapped then filtered value is ${value}`);
obs$.pipe(map(x => x * 2), filter(x => x < 12)).subscribe((value) => result.innerText += `\nMapped then filtered value (bis) is ${value}`);
