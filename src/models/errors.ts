export class FilterError implements Error {
    name: string = 'FilterError';
    message: string = 'Filter predicate was not matched';

    constructor(public stack?: string) {}
}

export class StopFleuveSignal implements Error {
    name: string = 'StopFleuveSignal';
    message: string = 'Predicate was not matched anymore, Fleuve stopped';
    
    constructor(public stack?: string) {}
}