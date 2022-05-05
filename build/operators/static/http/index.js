import { get as GET } from './get';
import { post as POST } from './post';
export var http;
(function (http) {
    http.get = GET;
    http.post = POST;
})(http || (http = {}));
