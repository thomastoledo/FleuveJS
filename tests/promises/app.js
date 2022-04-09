import {Http} from '../../bundle/observable.bundle.js';

const obs$ = Http.GET('./test.json');
obs$.subscribe((res) => {
    console.log(res);
    document.getElementById('results').innerText = res;
});