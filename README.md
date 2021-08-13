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
```ts
const johnDoe$ = new Fleuve({firstname: 'john', lastname: 'doe'});
const counter$ = new Fleuve(0);
```

### Provide new values with `next` and `compile`
```ts
const fleuve$ = new Fleuve(0);
fleuve$.next(12, 13, 14, 15, 16); // fleuve$ inner value will go from 12 to 16
fleuve$.compile((x) => x + 1, (x) => x * 2); // fleuve$ inner value will go from 16 to 17, then from 17 to 34
```

### Pipe the Fleuve
You can create a new Fleuve with the `pipe` method.

```ts
const fleuve$ = new Fleuve(18729);
const sum$ = fleuve$.pipe(
    (x) => (x + '').split(''), 
    (numbers) => numbers.reduce((acc, curr) => acc + curr, 0)
);
```

### Subscribe
```ts
const fleuve$ = new Fleuve(12);
fleuve$.subscribe((value) => console.log(value));

const empty$ = new Fleuve();
empty$.subscribe((value) => console.log(value)); // will never execute;

// This one will throw an error
fleuve$.subscribe(42);

```
### Add an event listener
You can bind users interactions to a Fleuve.

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
### Operators
`map` and `filter` operators are now available! You can use them that way:

```ts
const fleuve$ = new Fleuve(12);
fleuve$.pipe(filter(x => !!x), map(x => x * 2)).subscribe((value) => console.log(value));
```

### `fork` the Fleuve
You can fork a Fleuve. The new Fleuve will still be connected to the original Fleuve, but with some intermediaries operations.

```ts
const fleuve$ = new Fleuve(12);
const forked$ = fleuve$.fork(filter(x => x > 15));
forked$.subscribe(x => console.log(x)); // nothing would happen at first
fleuve$.next(20); // now, 20 would be printed in the browser's console
```

### You can stop a Fleuve's forks with the `close` method
No more values will be allowed and the forks will be flagged as complete.

```ts
const fleuve$ = new Fleuve(12);
const fork1$ = fleuve$.fork(map(x => x * 2));
const fork2$ = fork1$.fork(filter(x => x < 100));

fleuve$.close();
fork1$.subscribe(x => console.log('fork1$ value', x)); // will display "24"
fork2$.subscribe(x => console.log('fork2$ value', x)); // will display "24"

fleuve$.next(99); // the forks' subscribers won't be triggered
```

## Next Features
### Refactoring incoming
In the next release, some methods might be moved as static operators. Stay tuned!

### Next operators
#### For pipe / fork / compile
- until
- while
- nth
- take
- first

#### Static
##### Functions
- around
- before
- after
- whenThrowing

Example:
```js
function divide(x, y) {
    if (y === 0) {
        throw new Error('Invalid Denominator');
    }
    console.log(`x / y = ${x/y}`)
    return x / y;
}

const aroundDivide$ = around(divide);
const beforeDivide$ = before(divide);
const afterDivide$ = after(divide);
const whenThrowing = whenThrowing(divide);

aroundDivide$.subscribe((x) => console.log('Around division:', x));
beforeDivide$.subscribe(() => console.log('Before division'));
afterDivide$.subscribe((x) => console.log('After division:', x));
whenThrowing$.subscribe((err) => console.log('Throwing division:', err));

// Should display 'Around division: undefined', 'x / y = 2', 'Around division: 2'
aroundDivide$(10, 5);

// Should display 'Before division', 'x / y = 2'
beforeDivide$(10, 5);

// Should display 'x / y = 2', 'After division: 2'
afterDivide$(10, 5);

// Should display 'Throwing: Error: Invalid Denominator'
whenThrowing$(10, 0);
```

##### Creation
- of
- from

##### Predicates
- filter
- until
- while

##### Asynchronous
- websocket
- promise

### Allow to work with IndexedDB
### Allow to work with Promises
### Allow to work with RxJs Observables