export class FilterError implements Error {
    name: string = 'FilterError';
    message: string = 'Filter predicate was not matched';

    constructor(public stack?: string) {}
}