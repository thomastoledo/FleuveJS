export declare class FilterError implements Error {
    message: string;
    stack?: string | undefined;
    name: string;
    constructor(message?: string, stack?: string | undefined);
}
