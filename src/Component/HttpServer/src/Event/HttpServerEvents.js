/**
 * @memberOf Jymfony.Component.HttpServer.Event
 */
class HttpServerEvents { }

HttpServerEvents.REQUEST = 'http.request';
HttpServerEvents.EXCEPTION = 'http.exception';
HttpServerEvents.VIEW = 'http.view';
HttpServerEvents.CONTROLLER = 'http.controller';
HttpServerEvents.RESPONSE = 'http.response';
HttpServerEvents.TERMINATE = 'http.terminate';
HttpServerEvents.FINISH_REQUEST = 'http.finish_request';

module.exports = HttpServerEvents;
