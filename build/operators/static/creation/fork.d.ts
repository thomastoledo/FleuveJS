import { OperationResult, OperatorFunction } from "../../../models/operator";
import { Observable } from "../../../observable/observable";
import { ObservableFork } from "../../../observable/observable-fork";
export declare const fork: <T = never>(obs: Observable<T>, ...operators: OperatorFunction<T, OperationResult<any>>[]) => ObservableFork<any>;
