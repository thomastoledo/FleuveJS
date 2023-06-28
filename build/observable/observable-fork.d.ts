import { Observable } from "./observable";
import { OperatorFunction, OperationResult } from "../models/operator";
import { OnNext, Subscriber, Subscription } from "../models/subscription";
export declare class ObservableFork<T> extends Observable<T> {
    private sourceObs$;
    private subscriptions;
    private operators;
    private _isClosed;
    protected get innerSequence(): OperationResult<T>[];
    protected set innerSequence(sequence: OperationResult<T>[]);
    constructor(sourceObs$: Observable<T>, ...operators: OperatorFunction<T, OperationResult<any>>[]);
    subscribe(subscriber?: Subscriber<T> | OnNext<T> | undefined): Subscription;
    close(): void;
    private unsubscribe;
}
