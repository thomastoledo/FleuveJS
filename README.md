# FleuveJS

A simple Observable Utility library

## Installation
`npm i fleuvejs`

To use for frontend projects, for now you can use the latest version with UnPkg:

```js
import { Fleuve } from 'https://unpkg.com/fleuvejs@latest/index.js';
```

## How To Use

### Instantiate a Fleuve
```js
const johnDoe$ = new Fleuve({firstname: 'john', lastname: 'doe'});
const counter$ = new Fleuve(0);
```

### Provide new values
```js
const fleuve$ = new Fleuve(0);
fleuve$.next(12, 13, 14, 15, 16);
fleuve$.next((x) => x + 1, (x) => x * 2);

// This one will throw an error
fleuve$.next(12, (x) => x + 1);
```

### Pipe the Fleuve
```js
const fleuve$ = new Fleuve(18729);
const sum$ = fleuve$.pipe(
    (x) => (x + '').split(''), 
    (numbers) => numbers.reduce((acc, curr) => acc + curr, 0)
);
```

### Subscribe
```js
const fleuve$ = new Fleuve(12;
fleuve$.subscribe((value) => console.log(value));

// This one will throw an error
fleuve$.subscribe(42);
```


## Nex Features

### Allow to specify a event handler:

```html
<button id="clickMe">Click Me</button>
```

```js
const fleuve$ = new Fleuve();
fleuve$.addEventListener('#clickMe', (event, x) => console.log(event, x))
```

### Allow to work with Promises
### Allow to work with RxJs Observables
### More operators