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
fleuve$.subscribe((value) => console.log(value), (err) => console.error(err), () => console.log('fleuve complete'));

const empty$ = new Fleuve();
empty$.subscribe((value) => console.log(value)); // will never execute;

// This one will throw an error
fleuve$.subscribe(42);

// You can as well create a Subscriber object
fleuve$.subscribe(Subscriber.of((x) => console.log(x)));

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

#### `preProcess` - static
*This operator is static: it means you cannot use it as parameter for methods such as `pipe`, `compile` or `fork`*.

This operator allows you to create a Fleuve bearing pre-processing operations. Those operations will execute every time you provide a new value to the Fleuve.

It is useful if you want to connect to a source of data, and only retrieve those which match a predicate.

In the following example, we assume we want to retrieve some stats about temperatures, and we would like to only retrieve entries where the temperature is > 30°C;

```ts
const fleuve$ = preProcess(filter(stat => stat.temp > 30));

// displayStat is an arbitrary function we would have to implement
fleuve$.subscribe(stat => displayStat(stat));

fetch('someUrl')
    .then(res => res.json())
    .then(stats => fleuve$.next(...stats));
```

#### `map`

```ts
const fleuve$ = new Fleuve(12);
fleuve$.pipe(map(x => x * 2)).subscribe((value) => console.log(value)); // will display "24"
```

#### `switchmap`

```ts
const fleuve$ = new Fleuve(12);
fleuve$.pipe(switchmap((x) => {
    if (x > 0) {
        return new Fleuve(0);
    }
}));
```

#### `filter`

```ts
const fleuve$ = new Fleuve(12);
const filtered$ = fleuve$.pipe(filter(x => x > 10));
filtered$.subscribe((value) => console.log(value)); // will display "12" and "100"
filtered$.next(0);
filtered$.next(100); 
```
#### `until`

```ts
const fleuve$ = preProcess(until(x => x >= 10));
fleuve$.subscribe((value) => console.log(value)); // will display 0, 1, ..., 9

for(let i = 0; i < 11; i++) {
    fleuve$.next(i);
}
```

#### `asLongAs`
```ts
const fleuve$ = preProcess(asLongAs(x => x < 10));
fleuve$.subscribe((value) => console.log(value)); // will display 0, 1, ..., 9

for(let i = 0; i < 11; i++) {
    fleuve$.next(i);
}
```

### `fork` the Fleuve
You can fork a Fleuve. The new Fleuve will still be connected to the original Fleuve, but with some pre-processing operations.

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
- nth
- take
- once
- ifElse

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
- preProcess

##### Asynchronous
- websocket
- promise

##### Replacement
- replace
- replaceNth
- replaceN
- replaceAll

### Allow to work with IndexedDB
### Allow to work with Promises
### Allow to work with RxJs Observables