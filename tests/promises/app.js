import {http} from '../../bundle/observable.bundle.js';

const obs$ = http.get('./test.json');
obs$.subscribe((res) => {
    console.log(res);
    document.getElementById('results').innerText = res;
});