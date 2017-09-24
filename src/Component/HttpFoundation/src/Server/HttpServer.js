const http = require('http');

class HttpServer {
    __construct(transport = new http.Server(), config = {}) {
        /**
         * @type {http.Server}
         */
        this._transport = transport;
    }
}

module.exports = HttpServer;
