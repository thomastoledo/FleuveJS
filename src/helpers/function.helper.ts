export function isFunction(fn: any): fn is Function {
    return typeof fn === 'function';
}

export function filterNonFunctions(...fns: any[]): Function[] {
    return fns.filter((f) => isFunction(f));
}