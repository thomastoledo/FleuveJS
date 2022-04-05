# ObservableJS

![logo](https://github.com/nugetchar/ObservableJS/blob/main/logo.png)

A simple Observable Utility library.

## Why?
Observable is called that way because of the philosophy behind: every Observable is a data stream, potentially infinite.
You can add your own data to the Observable, and everyone on the Observable will be notified.

You can also add some pipeline to the Observable, so what you receive has been processed in a convenient way before.

You can bind an Observable behavior to the user's behavior.

A Observable can be forked into multiple other Observables: each Observable child will dispatch some data everytime their parent dispatch some data. You can also close your stream of data, and everyone will know the Observable is complete.

In short:
- potentially infinite source of data;
- cascading Observables by forking a data stream;
- data pre-processing;
- aims to allow practically anything as a source of data: a function execution, a user's action, a scalar value, a websocket...

Any contribution and / or feedback is welcomed!

## Installation
`npm i observablejs`

Or, if you'd prefer to work on a vanilla project:

```js
import { Observable } from 'https://unpkg.com/observablejs@latest/bundle/observable.bundle.js';
```

## Observables and MutableObservables

`Observables` are objects containing an inner sequence. Their sequence is finite, and they are immutable.
`MutableObservables` are objects containing an inner sequence too, except this one can be mutated over time. It is infinite, and can be completed with the `.close()` method.
`ObservableFork` are objects created from either `Observable`, `MutableObservable` or `ObservableFork`:
- they can be closed;
- they can be potentially infinite;
- they **cannot** be mutated;
- they can come with pre-processing operations: when the source emits a new value, the pre-processing operations will be executed on it before being passed to the fork's subscribers.

## How To Use Observables

## Instantiate an Observable
```ts
const temperatures$ = of(10, 20, 13, 24);
```

### Pipe the Observable
You can create a new Observable with the `pipe` method.

```ts
const obs$ = of(18729);
const sum$ = obs$.pipe(
    map((x) => (x + '').split('')), 
    map((numbers) => numbers.reduce((acc, curr) => acc + curr, 0))
);
```

### Subscribe to the Observable

```ts
const obs$ = of(12);
obs$.subscribe({
    next: (value) => console.log(value), 
    error: (err) => console.error(err), 
    compleyte: () => console.log('observable complete')
});

const empty$ = of();
empty$.subscribe((value) => console.log(value)); // will never execute;

// This one will throw an error
obs$.subscribe(42);

// You can as well create a Subscriber object
obs$.subscribe(subscriberOf((x) => console.log(x)));

```
### Add an event listener
You can bind users interactions to an Observable.

```html
<button id="clickMe">Click Me</button>
```

```js
const obs$ = onEvent(document.getElementById("clickMe"), "click");
obs$.subscribe((event) => console.log('event triggered', event));
```

## How To Use MutableObservables

`MutableObservable` simply extends `Observable`. All of the previous sections also apply to `MutableObservable`.

### Provide new values with `next` and `compile`
```ts
const obs$ = mutable(0);
obs$.next(12, 13, 14, 15, 16); // obs$ inner sequence will now be [ 12, 13, 14, 15, 16 ]
obs$.compile(map((x) => x + 1), map((x) => x * 2)); // obs$ inner sequence will now be [ 26, 28, 30, 32, 34 ]
```

### Close a MutableObservable with `close`

```ts
const obs$ = mutable(0);
obs$.close();
```

## How to use ObservableForks

### `fork` observables

```ts
const obs$ = mutable(12);
const forked$ = fork(obs$, filter(x => x > 15));
forked$.subscribe(x => console.log(x)); // nothing would happen at first
obs$.next(20); // now, 20 would be printed in the browser's console
```

### Stop a fork
No more values will be allowed and the forks will be flagged as complete.

```ts
const obs$ = mutable(12);
const fork1$ = fork(obs$, map(x => x * 2));
const fork2$ = fork(obs$, filter(x => x > 100));

const subscriber = subscriberOf((x) => console.log('fork1$ value', x), () => console.log('fork1 complete'));
fork1$.subscribe(subscriber); // will display "24"

fork2$.subscribe((x) => console.log('fork2$ value', x)); // will display nothing

obs$.close(); // will trigger fork1$'s complete callback
obs$.next(99); // the forks' subscribers won't be triggered
```

### Operators
#### `of` - static
*This operator is static: it means you cannot use it as a parameter for methods such as `pipe`, `compile` or `fork`.*

This operator allows you to create an Observable from discrete values. It creates a finite Observable. Once created, the Observable is automatically complete.

```ts
const obs$ = of(12, 13, 14);
obs$.subscribe(subscriberOf((x) => console.log(x))); // will display "12", "13", "14"
```

#### `from` - static
*This operator is static: it means your cannot use it as a parameter for methods such as `pipe` or `compile`*

This operator works just like `of`, except it will take an array as a parameter, and flatten it.

#### `mutable` - static
*This operator is static: it means your cannot use it as a parameter for methods such as `pipe` or `compile`*

This operator works just like `of`, except it will return a `MutableObservable` instead of an `Observable`.

#### `mutableFrom` - static
*This operator is static: it means your cannot use it as a parameter for methods such as `pipe` or `compile`*

This operator works just like `from`, except it will return a `MutableObservable` instead of an `Observable`.

#### `preProcess` - static
*This operator is static: it means your cannot use it as a parameter for methods such as `pipe` or `compile`*

This operator allows you to create a MutableObservable bearing pre-processing operations. Those operations will execute every time you provide a new value to the MutableObservable.

It is useful if you want to connect to a source of data, and only retrieve those that match a predicate.

In the following example, we assume we want to retrieve some stats about temperatures, and we would like to only retrieve entries where the temperature is > 30°C;

```ts
const obs$ = preProcess(filter(stat => stat.temp > 30));

// displayStat is an arbitrary function we would have to implement
obs$.subscribe(stat => displayStat(stat));

fetch('someUrl')
    .then(res => res.json())
    .then(stats => obs$.next(...stats));
```

#### `map`

```ts
const obs$ = of(12);
obs$.pipe(map(x => x * 2)).subscribe((value) => console.log(value)); // will display "24"
```

#### `switchmap`

```ts
const obs$ = of(12);
obs$.pipe(switchmap((x) => {
    if (x > 0) {
        return of(0);
    }
}));
```

#### `filter`

```ts
const obs$ = of(12, 0, -1, 100);
const filtered$ = obs$.pipe(filter(x => x > 10));
filtered$.subscribe((value) => console.log(value)); // will display "12" and "100"
```
#### `until`

```ts
const obs$ = preProcess(until(x => x >= 10));
obs$.subscribe((value) => console.log(value)); // will display 0, 1, ..., 9

for(let i = 0; i < 100; i++) {
    obs$.next(i);
}
```

#### `asLongAs`
```ts
const obs$ = preProcess(asLongAs(x => x < 10));
obs$.subscribe((value) => console.log(value)); // will display 0, 1, ..., 9

for(let i = 0; i < 11; i++) {
    obs$.next(i);
}
```

#### `ifElse`
The `ifElse` operator is pretty useful when it comes to add branches to an Observable. it can be used either on a `pipe` or `compile` method or on a *creation operator* such as `preProcess`.

In the next example, we want to sort out some data and apply a different process according to each value. Values over 30 will trigger logging treatment, while others will just trigger an API call.

```ts
const temperatures = [-15, 0, 12, 16, 30, 35, 45, -8];
const obs$ = preProcess(
    ifElse((x) => x > 30, 
            [tap((x) => logError(`Unexpected value: ${x}`))], 
            [tap((x) => saveTemp(x))])
    );
obs$.next(...temperatures);
```

#### `tap`
The `tap` operator is useful when it comes to trigger a treatment that won't affect the outcome of the `pipe` / `compile` operation.

```ts
const obs$ = of(12);
const piped$ = obs$.pipe(tap(x => console.log(x), map(x => x * 2))); // expected to print 12
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
- compose: to compose finite and infinite Observable creators

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