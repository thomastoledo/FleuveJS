export class FilterError {
    message;
    stack;
    name = 'FilterError';
    constructor(message = '', stack) {
        this.message = message;
        this.stack = stack;
    }
}
