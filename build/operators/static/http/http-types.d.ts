export type HttpOptions = RequestInit & {
    type?: HttpResultOption;
};
export type HttpResultOption = 'text' | 'json' | 'blob';
