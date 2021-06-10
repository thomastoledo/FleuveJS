const { Observable } = require('./node_modules/observable-eemi-js/build/index');

const obs = new Observable([1, 2, 3]);
obs.subscribe((value) => console.log(value));