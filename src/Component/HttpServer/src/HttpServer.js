const BadRequestHttpException = Jymfony.Component.HttpFoundation.Exception.BadRequestHttpException;
const HttpExceptionInterface = Jymfony.Component.HttpFoundation.Exception.HttpExceptionInterface;
const NotFoundHttpException = Jymfony.Component.HttpFoundation.Exception.NotFoundHttpException;
const RequestExceptionInterface = Jymfony.Component.HttpFoundation.Exception.RequestExceptionInterface;
const ContentType = Jymfony.Component.HttpFoundation.Header.ContentType;
const Request = Jymfony.Component.HttpFoundation.Request;
const Response = Jymfony.Component.HttpFoundation.Response;
const Event = Jymfony.Component.HttpServer.Event;
const RequestParser = Jymfony.Component.HttpServer.RequestParser;

/**
 * @memberOf Jymfony.Component.HttpServer
 */
class HttpServer {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.EventDispatcher.EventDispatcherInterface} dispatcher
     * @param {Jymfony.Component.HttpFoundation.Controller.ControllerResolverInterface} resolver
     * @param {http.Server} http
     */
    __construct(dispatcher, resolver, http = require('http')) {
        /**
         * @type {Jymfony.Component.EventDispatcher.EventDispatcherInterface}
         * @protected
         */
        this._dispatcher = dispatcher;

        /**
         * @type {Jymfony.Component.HttpFoundation.Controller.ControllerResolverInterface}
         * @protected
         */
        this._resolver = resolver;

        /**
         * @type {http.Server}
         * @protected
         */
        this._http = new http.Server(this._incomingRequest.bind(this));
    }

    /**
     * Listen and handle connections.
     *
     * @returns {Promise<void>}
     */
    listen({ port = 80, host = '0.0.0.0', path = undefined } = {}) {
        return new Promise((resolve, reject) => {
            this._http.on('error', e => {
                this._http.removeAllListeners('close');
                this._http.close();

                reject(e);
            });

            this._http.on('close', resolve);

            if (!! path) {
                this._http.listen({ path });
            } else {
                this._http.listen({ host, port });
            }
        });
    }

    /**
     * Handles an incoming request from the http server.
     *
     * @param {IncomingMessage} req
     * @param {ServerResponse} res
     *
     * @private
     */
    _incomingRequest(req, res) {
        return __jymfony.Async
            .run(this._handleRequest(req, res))
            .catch(() => {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.write('Unknown error while handling your request.\r\n');
                res.end();
            });
    }

    /**
     * Converts an IncomingMessage to an HttpFoundation request
     * and sends it to the Kernel.
     *
     * @param {IncomingMessage} req
     * @param {ServerResponse} res
     *
     * @protected
     */
    * _handleRequest(req, res) {
        const contentType = new ContentType(req.headers['content-type'] || 'application/x-www-form-urlencoded');
        let requestParams, content;

        try {
            [ requestParams, content ] = yield this._parseRequestContent(req, contentType);
        } catch (e) {
            if (e instanceof BadRequestException) {
                res.writeHead(400, {'Content-Type': 'text/plain'});
            } else {
                res.writeHead(500, {'Content-Type': 'text/plain'});
            }

            res.end();
            return;
        }

        const request = new Request(req.url, requestParams, {}, req.headers, {
            'REQUEST_METHOD': req.method,
            'REMOTE_ADDR': req.connection.remoteAddress,
            'SCHEME': this._getScheme(),
            'SERVER_PROTOCOL': 'HTTP/'+req.httpVersion,
        }, content);

        const response = yield this.handle(request);
        response.prepare(request);

        res.writeHead(response.statusCode, response.statusText, response.headers.all);
        yield new Promise((resolve) => {
            res.write(response.content, 'utf8', () => {
                resolve();
            });
        });

        res.end();
    }

    /**
     * Handles a Request to convert it to a Response.
     *
     * When catchExceptions is true, catches all exceptions
     * and do its best to convert them to a Response instance.
     *
     * @param {Jymfony.Component.HttpFoundation.Request} request A Request instance
     * @param {boolean} catchExceptions Whether to catch exceptions or not
     *
     * @returns {Jymfony.Component.HttpFoundation.Response} A Response instance
     *
     * @throws {Exception} When an Exception occurs during processing
     */
    * handle(request, catchExceptions = true) {
        let response;

        try {
            response = yield this._handleRaw(request);
        } catch (e) {
            if (e instanceof RequestExceptionInterface) {
                e = new BadRequestHttpException(e.message, e);
            }

            if (false === catchExceptions) {
                throw e;
            }

            response = yield this._handleException(e, request);
        }

        return response;
    }

    /**
     * Parse request content.
     *
     * @param {IncomingMessage} req
     * @param {Jymfony.Component.HttpFoundation.Header.ContentType} contentType
     *
     * @returns {Array} An array composed by the request params object
     *                  and the content as Buffer
     *
     * @protected
     */
    * _parseRequestContent(req, contentType) {
        const contentLength = ~~req.headers['content-length'] || undefined;

        let parser;
        if ('application/x-www-form-urlencoded' === contentType.essence) {
            parser = new RequestParser.UrlEncodedParser(req, contentLength);
        } else if ('application/json' === contentType.essence) {
            parser = new RequestParser.JsonEncodedParser(req, contentLength);
        } else if ('multipart' === contentType.type) {
            parser = new RequestParser.MultipartParser(req, contentType, contentLength);
        } else {
            parser = new RequestParser.OctetStreamParser(req, contentLength);
        }

        const params = yield parser.parse();

        return [ params, parser.buffer ];
    }

    /**
     * Dispatches request through the event dispatcher to obtain a valid response.
     *
     * @param {Jymfony.Component.HttpFoundation.Request} request
     *
     * @returns {Jymfony.Component.HttpFoundation.Response}
     *
     * @protected
     */
    * _handleRaw(request) {
        let event = new Event.GetResponseEvent(this, request);
        yield this._dispatcher.dispatch(Event.HttpServerEvents.REQUEST, event);

        if (event.hasResponse()) {
            return yield this._filterResponse(event.response, request);
        }

        let controller = this._resolver.getController(request);
        if (false === controller) {
            throw new NotFoundHttpException(__jymfony.sprintf('Unable to find the controller for path "%s". The route is wrongly configured.', request.pathInfo));
        }

        event = new Event.FilterControllerEvent(this, controller, request);
        yield this._dispatcher.dispatch(Event.HttpServerEvents.CONTROLLER, event);
        controller = event.controller;

        const response = yield __jymfony.Async.run(controller, request);
        if (! (response instanceof Response)) {
            let msg = 'The controller must return a response.';

            // The user may have forgotten to return something
            if (undefined === response) {
                msg += ' Did you forget to add a return statement somewhere in your controller?';
            }

            throw new LogicException(msg);
        }

        return yield this._filterResponse(response, request);
    }

    /**
     * Handles an exception by trying to convert it to a Response.
     *
     * @param {Error} e An Error instance
     * @param {Jymfony.Component.HttpFoundation.Request} request A Request instance
     *
     * @protected
     */
    * _handleException(e, request) {
        const event = new Event.GetResponseForExceptionEvent(this, request, e);
        yield this._dispatcher.dispatch(Event.HttpServerEvents.EXCEPTION, event);

        // A listener might have replaced the exception
        e = event.exception;
        if (! event.hasResponse()) {
            yield this._dispatcher.dispatch(Event.HttpServerEvents.FINISH_REQUEST, new Event.FinishRequestEvent(this, request));

            throw e;
        }

        const response = event.response;

        // The developer asked for a specific status code
        if (! event.isAllowingCustomResponseCode && ! response.isClientError && ! response.isServerError && ! response.isRedirect()) {
            // Ensure that we actually have an error response
            if (e instanceof HttpExceptionInterface) {
                // Keep the HTTP status code and headers
                response.setStatusCode(e.statusCode);
                response.headers.add(e.headers);
            } else {
                response.setStatusCode(500);
            }
        }

        try {
            return yield this._filterResponse(response, request);
        } catch (e) {
            return response;
        }
    }

    /**
     * Gets the request scheme.
     *
     * @return {string}
     *
     * @protected
     */
    _getScheme() {
        return 'http';
    }

    /**
     * Filters a response object.
     *
     * @param {Jymfony.Component.HttpFoundation.Response} response
     * @param {Jymfony.Component.HttpFoundation.Request} request
     *
     * @returns {Jymfony.Component.HttpFoundation.Response}
     *
     * @private
     */
    * _filterResponse(response, request) {
        const event = new Event.FilterResponseEvent(this, request, response);
        yield this._dispatcher.dispatch(Event.HttpServerEvents.RESPONSE, event);
        yield this._dispatcher.dispatch(Event.HttpServerEvents.FINISH_REQUEST, new Event.FinishRequestEvent(this, request));

        return event.response;
    }
}

module.exports = HttpServer;
