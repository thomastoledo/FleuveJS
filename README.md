# FleuveJS

A simple Observable Utility library

## Installation
`npm i fleuvejs`

Or, if you'd prefer to work on a vanilla project:

```js
import { Fleuve } from 'https://unpkg.com/browse/fleuvejs@latest/bundle/fleuve.bundle.js';
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
const fleuve$ = new Fleuve(12);
fleuve$.subscribe((value) => console.log(value));

// This one will throw an error
fleuve$.subscribe(42);

```
### Add an event listener:

```html
<button id="clickMe">Click Me</button>
```

```js
const fleuve$ = new Fleuve();
const eventSubscription = fleuve$.addEventListener('#clickMe', 'click', (x, event) => console.log(x, event))
```

### Remove an event listener
```js
eventSubscription.unsubscribe();
```
## Operators
`map` and `filter` operators are now available! You can use them that way:

```ts
const fleuve$ = new Fleuve(12);
fleuve$.pipe(filter(x => !!x), map(x => x * 2)).subscribe((value) => console.log(value));
```
## Next Features
### Prevent emiting when a filter has stopped the Fleuve
Right now it emit an `undefined` value.

### Add the `fork` method
Should allow to fork a Fleuve. The new Fleuve would still be connected to the original Fleuve, but with some intermediaries operations.

```ts
const fleuve$ = new Fleuve(12);
const forked$ = fleuve$.fork(filter(x => x > 15));
forked$.subscribe(x => console.log(x)); // nothing would happen at first
fleuve$.next(20); // now, 20 would be printed in the browser's console
```
### Add the `dam` method
Should stop a Fleuve and all its forks. No more values would be allowed.

### More Operators

### Allow to work with Promises
### Allow to work with RxJs Observables