# FleuveJS

![logo](https://github.com/nugetchar/FleuveJS/blob/main/logo.png)

A simple Observable Utility library.

## Why?
Fleuve is called that way because of the philosophy behind: every Fleuve is a data stream, potentially infinite.
You can add your own data to the Fleuve, and everyone on the Fleuve will be notified.

You can also add some pipeline to the Fleuve, so what you receive has been processed in a convenient way before.

You can bind a Fleuve behavior to the user's behavior.

A Fleuve can be forked into multiple other Fleuves: each Fleuve child will dispatch some data everytime their parent dispatch some data. You can also close your stream of data, and everyone will know the Fleuve is complete.

In short:
- potentially infinite source of data;
- cascading Fleuves by forking a data stream;
- data pre-processing;
- aims to allow practically anything as a source of data: a function execution, a user's action, a scalar value, a websocket...

Any contribution and / or feedback is welcomed!

## Installation
`npm i fleuvejs`

Or, if you'd prefer to work on a vanilla project:

```js
import { Fleuve } from 'https://unpkg.com/browse/fleuvejs@latest/bundle/fleuve.bundle.js';
```

## How To Use

### Instantiate a Fleuve

*Warning: soon to be deprecated in favor of static operators `of` and `from`*
```ts
const johnDoe$ = new Fleuve({firstname: 'john', lastname: 'doe'});
const counter$ = new Fleuve(0);
```

### Provide new values with `next` and `compile`
```ts
const fleuve$ = new Fleuve(0);
fleuve$.next(12, 13, 14, 15, 16); // fleuve$ inner value will go from 12 to 16
fleuve$.compile(map((x) => x + 1), map((x) => x * 2)); // fleuve$ inner value will go from 16 to 17, then from 17 to 34
```

### Close a fleuve with `close`

```ts
const fleuve$ = new Fleuve(0);
fleuve$.close();
```

### Pipe the Fleuve
You can create a new Fleuve with the `pipe` method.

```ts
const fleuve$ = new Fleuve(18729);
const sum$ = fleuve$.pipe(
    map((x) => (x + '').split('')), 
    map((numbers) => numbers.reduce((acc, curr) => acc + curr, 0))
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
fleuve$.subscribe(subscriberOf((x) => console.log(x)));

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

### `fork` the Fleuve
*Warning: might become a static operator rather than a method of the Fleuve class*

You can fork a Fleuve. The new Fleuve will still be connected to the original Fleuve, but with some pre-processing operations.

```ts
const fleuve$ = new Fleuve(12);
const forked$ = fleuve$.fork(filter(x => x > 15));
forked$.subscribe(x => console.log(x)); // nothing would happen at first
fleuve$.next(20); // now, 20 would be printed in the browser's console
```

### You can stop a Fleuve's forks with the `closeForks` method
No more values will be allowed and the forks will be flagged as complete.

```ts
const fleuve$ = new Fleuve(12);
const fork1$ = fleuve$.fork(map(x => x * 2));
const fork2$ = fork1$.fork(filter(x => x < 100));

fleuve$.closeForks();
fork1$.subscribe(x => console.log('fork1$ value', x)); // will display "24"
fork2$.subscribe(x => console.log('fork2$ value', x)); // will display "24"

fleuve$.next(99); // the forks' subscribers won't be triggered
```

### Operators
#### `of` - static
*This operator is static: it means you cannot use it as a parameter for methods such as `pipe`, `compile` or `fork`.*

This operator allows you to create a Fleuve from a single scalar value. It creates a finite Fleuve with one or multiple scalar values. Once created, the Fleuve is automatically complete.

```ts
const fleuve$ = of(12);
fleuve$.subscribe(subscriberOf((x) => console.log(x)))
```

#### `preProcess` - static
*This operator is static: it means you cannot use it as a parameter for methods such as `pipe`, `compile` or `fork`*.

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

#### `ifElse`
The `ifElse` operator is pretty useful when it comes to add branches to a Fleuve. it can be used either on a `pipe`, `compile`, `fork` method or on a *creation operator* such as `preProcess`.

If the next example, we want to sort out some data and apply a different process according to each value. Values over 30 will trigger logging treatment, while others will just trigger an API call.

```ts
const temperatures = [-15, 0, 12, 16, 30, 35, 45, -8];
const fleuve$ = preProcess(
    ifElse((x) => x > 30, 
            [tap((x) => logError(`Unexpected value: ${x}`))], 
            [tap((x) => saveTemp(x))])
    );
fleuve$.next(...temperatures);
```

#### `tap`
The `tap` operator is useful when it comes to trigger a treatment that won't affect the outcome of the `pipe` / `compile` / `fork` operation.

```ts
const fleuve$ = of(12);
const piped$ = fleuve$.pipe(tap(x => console.log(x), map(x => x * 2))); // expected to print 12
piped$.subscribe((x) => console.log(x)); // expected to print 24
```

## Next Features
### Refactoring incoming
In the next release, some methods might be moved as static operators. Stay tuned!

### Next operators
#### For pipe / fork / compile
- nth
- take
- once
- times
- catchError
- throwError
- debounce
- throttle
- reduce
- min
- max


#### Static
##### Functions
- around
- before
- after
- whenThrowing
- onFunction

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
- from: a finite Fleuve from a finite sequence
- preProcess: an infinite Fleuve with zero or multiple pre-processing operations
- infinite: an infinite Fleuve
- compose: to compose finite and infinite Fleuve creators

##### Asynchronous
- websocket
- promise

##### Replacement
- replace
- replaceNth
- replaceN
- replaceAll

##### Predicates
- or
- and
- xor
- not

### Allow to work with IndexedDB
### Allow to work with Promises
### Allow to work with RxJs Observables