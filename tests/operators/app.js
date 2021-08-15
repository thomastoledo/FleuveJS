import {Fleuve, map, filter} from '../../bundle/fleuve.bundle.js';


const result = document.getElementById('results');
const fleuve$ = new Fleuve(12);

fleuve$.pipe(map(x => x * 2)).subscribe((value) => result.innerText += `Mapped value is ${value}`);
fleuve$.pipe(filter(x => x > 1000)).subscribe((value) => result.innerText += `\nFiltered value is ${value}`);
fleuve$.pipe(map(x => x * 2), filter(x => x > 12)).subscribe((value) => result.innerText += `\nMapped then filtered value is ${value}`);
fleuve$.pipe(map(x => x * 2), filter(x => x < 12)).subscribe((value) => result.innerText += `\nMapped then filtered value (bis) is ${value}`);
