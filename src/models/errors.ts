export class FilterError implements Error {
    name: string = 'FilterError';
    message: string = 'Filter predicate was not matched';

    constructor(public stack?: string) {}
}

export class UntilError implements Error {
    name: string = 'UntilError';
    message: string = 'Until predicate not matched anymore';
    
    constructor(public stack?: string) {}
}