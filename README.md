# SimpleObservable

A simple Observable Utility library

## Installation
`npm i simple-observable`

## How To Use
```js
const simpleObservable = new SimpleObservable({firstname: 'john', lastname: 'doe'});
simpleObservable.subscribe((user) => console.log(user));
simpleObservable.next({firstname: 'John', lastname: 'DOE'});
const onlyLastameObs = simpleObservable.pipe(user => user.lastname);
```