export declare class FilterError implements Error {
    stack?: string | undefined;
    name: string;
    message: string;
    constructor(stack?: string | undefined);
}
