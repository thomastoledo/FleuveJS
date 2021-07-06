export class FilterError {
    stack;
    name = 'FilterError';
    message = 'Filter predicate was not matched';
    constructor(stack) {
        this.stack = stack;
    }
}
