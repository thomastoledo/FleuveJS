// import { MutableObservable, Observable } from ".";
// import { OperatorFunction, OperationResult } from "../models/operator";
// import { subscriberOf, Subscription } from "../models/subscription";

// export class ObservableFork<T> extends Observable<T> {
//   private subscription!: Subscription;

//   constructor(
//     obs: Observable<T>,
//     ...operators: OperatorFunction<T, OperationResult<any>>[]
//   ) {
//     super();
//     this.subscription = obs.subscribe({
//       next: (value) => this._subscribers.forEach(s => s.next && s.next(this._executeOperations<T, T>(value, operators).value)),
//       error: (err) => {
//         this._error = err;
//         this._complete();
//         this._triggerOnError();
//       },
//       complete: () => {
//         this.subscription.unsubscribe();
//         this._complete();
//         this._triggerOnComplete();
//       },
//     });
//   }

//   close() {
//     this.closeForks();
//   }

//   closeForks(): void {
//     // this._forks$.forEach((fork$) => {
//     //   fork$.closeForks();
//     //   fork$._complete();
//     //   fork$._triggerOnComplete();
//     // });
//   }
// }
