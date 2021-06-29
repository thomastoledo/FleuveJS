export class FilterError implements Error {
    name: string = 'FilterError';

    constructor(public message: string = '', public stack?: string) {
     }
}