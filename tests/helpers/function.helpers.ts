export function fail(message: string = "", ...args: any[]) {
    const errorMsg = `Test failed\n${message} ${args.reduce(
      (acc, curr) => `${acc} ${curr}`,
      ""
    )}`;
    throw new Error(errorMsg);
  }