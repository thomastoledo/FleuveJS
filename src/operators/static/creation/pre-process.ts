import { Fleuve } from "../../../fleuve/fleuve";
import { OperationResult, OperatorFunction } from "../../../models/operator";

export function preProcess<T = never>(...operations: OperatorFunction<any, OperationResult<T>>[]): Fleuve<T> {
    const fleuve$ = new Fleuve<T>();
    (fleuve$ as any)._preProcessOperations.push(...operations);
    return fleuve$;
}