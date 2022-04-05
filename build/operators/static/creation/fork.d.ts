import { OperationResult, OperatorFunction } from "../../../models/operator";
import { Observable, ObservableFork } from "../../../observable";
export declare const fork: <T = never>(obs: Observable<T>, ...operators: OperatorFunction<T, OperationResult<any>>[]) => ObservableFork<any>;
