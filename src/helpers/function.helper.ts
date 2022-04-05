export function isFunction(fn: any): fn is Function {
    return typeof fn === 'function';
}

export function filterNonFunctions(...fns: any[]): Function[] {
    return fns.filter((f) => isFunction(f));
}

/* istanbul ignore next */
export function fail(message: string = "", ...args: any[]) {
    const errorMsg = `Test failed\n${message} ${args.reduce(
      (acc, curr) => `${acc} ${curr}`,
      ""
    )}`;
    throw new Error(errorMsg);
  }