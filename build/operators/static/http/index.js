import { get as GET } from './get';
export var http;
(function (http) {
    http.get = GET;
})(http || (http = {}));
