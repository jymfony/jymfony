const LoggerAwareInterface = Jymfony.Component.Logger.LoggerAwareInterface;
const BadRequestHttpException = Jymfony.Component.HttpFoundation.Exception.BadRequestHttpException;
const HttpExceptionInterface = Jymfony.Component.HttpFoundation.Exception.HttpExceptionInterface;
const NotFoundHttpException = Jymfony.Component.HttpFoundation.Exception.NotFoundHttpException;
const RequestExceptionInterface = Jymfony.Component.HttpFoundation.Exception.RequestExceptionInterface;
const Response = Jymfony.Component.HttpFoundation.Response;
const Event = Jymfony.Component.HttpServer.Event;
const RequestParser = Jymfony.Component.HttpServer.RequestParser;
const NullLogger = Jymfony.Component.Logger.NullLogger;

/**
 * A Request handler.
 * Should be extended from servers/request handlers.
 *
 * @memberOf Jymfony.Component.HttpServer
 */
class RequestHandler extends implementationOf(LoggerAwareInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Contracts.EventDispatcher.EventDispatcherInterface} dispatcher
     * @param {Jymfony.Component.HttpFoundation.Controller.ControllerResolverInterface} resolver
     */
    __construct(dispatcher, resolver) {
        /**
         * @type {Jymfony.Contracts.EventDispatcher.EventDispatcherInterface}
         *
         * @protected
         */
        this._dispatcher = dispatcher;

        /**
         * @type {Jymfony.Component.HttpFoundation.Controller.ControllerResolverInterface}
         *
         * @protected
         */
        this._resolver = resolver;

        /**
         * @type {Jymfony.Component.Logger.LoggerInterface}
         *
         * @protected
         */
        this._logger = new NullLogger();
    }

    /**
     * Gets the current event dispatcher.
     *
     * @returns {Jymfony.Contracts.EventDispatcher.EventDispatcherInterface}
     */
    get eventDispatcher() {
        return this._dispatcher;
    }

    /**
     * Sets the logger for the current http server.
     *
     * @param {Jymfony.Component.Logger.LoggerInterface} logger
     */
    setLogger(logger) {
        this._logger = logger;
    }

    /**
     * Handles a Request to convert it to a Response.
     *
     * When catchExceptions is true, catches all exceptions
     * and do its best to convert them to a Response instance.
     *
     * @param {Jymfony.Component.HttpFoundation.Request} request A Request instance
     * @param {boolean} [catchExceptions = true] Whether to catch exceptions or not
     *
     * @returns {Promise<Jymfony.Component.HttpFoundation.Response>} A Response instance
     *
     * @throws {Exception} When an Exception occurs during processing
     */
    async handle(request, catchExceptions = true) {
        let response;

        try {
            response = await this._handleRaw(request);
        } catch (e) {
            if (e instanceof RequestExceptionInterface) {
                e = new BadRequestHttpException(e.message, e);
            }

            if (false === catchExceptions) {
                throw e;
            }

            response = await this._handleException(e, request);
        }

        return response;
    }

    /**
     * Get the public scheme for this server (http/https)
     *
     * @returns {string}
     */
    get scheme() {
        return 'http';
    }

    /**
     * Parse request content.
     *
     * @param {stream.Duplex} stream
     * @param {Object} headers
     * @param {Jymfony.Component.HttpFoundation.Header.ContentType} contentType
     *
     * @returns {Promise<Array>} An array composed by the request params object
     *     and the content as Buffer
     *
     * @protected
     */
    async _parseRequestContent(stream, headers, contentType) {
        if (headers['sec-websocket-key']) {
            return [ {}, undefined ];
        }

        const contentLength = ~~headers['content-length'];
        let parser;
        if ('application/x-www-form-urlencoded' === contentType.essence) {
            parser = new RequestParser.UrlEncodedParser(stream, contentLength);
        } else if ('application/json' === contentType.essence) {
            parser = new RequestParser.JsonEncodedParser(stream, contentLength, contentType.get('charset', 'utf-8'));
        } else if ('multipart' === contentType.type) {
            parser = new RequestParser.MultipartParser(stream, contentType, contentLength);
        } else {
            parser = new RequestParser.OctetStreamParser(stream, contentLength);
        }

        const params = await parser.parse();

        return [ params, parser.buffer ];
    }

    /**
     * Dispatches request through the event dispatcher to obtain a valid response.
     *
     * @param {Jymfony.Component.HttpFoundation.Request} request
     *
     * @returns {Promise<Jymfony.Component.HttpFoundation.Response>}
     *
     * @protected
     */
    async _handleRaw(request) {
        let event = new Event.GetResponseEvent(this, request);
        await this._dispatcher.dispatch(Event.HttpServerEvents.REQUEST, event);

        if (event.hasResponse()) {
            return await this._filterResponse(event.response, request);
        }

        let controller = this._resolver.getController(request);
        if (false === controller) {
            throw new NotFoundHttpException(__jymfony.sprintf('Unable to find the controller for path "%s". The route is wrongly configured.', request.pathInfo));
        }

        event = new Event.FilterControllerEvent(this, controller, request);
        await this._dispatcher.dispatch(Event.HttpServerEvents.CONTROLLER, event);
        controller = event.controller;

        let response = await controller(request);
        if (! (response instanceof Response)) {
            const event = new Event.GetResponseForControllerResultEvent(this, request, response);
            await this._dispatcher.dispatch(Event.HttpServerEvents.VIEW, event);

            if (event.hasResponse()) {
                response = event.response;
            } else {
                let msg = 'The controller must return a response.';

                // The user may have forgotten to return something
                if (undefined === response) {
                    msg += ' Did you forget to add a return statement somewhere in your controller?';
                }

                throw new LogicException(msg);
            }
        }

        return await this._filterResponse(response, request);
    }

    /**
     * Handles an exception by trying to convert it to a Response.
     *
     * @param {Error} e An Error instance
     * @param {Jymfony.Component.HttpFoundation.Request} request A Request instance
     *
     * @returns {Promise<Jymfony.Component.HttpFoundation.Response>}
     *
     * @protected
     */
    async _handleException(e, request) {
        const event = new Event.GetResponseForExceptionEvent(this, request, e);
        await this._dispatcher.dispatch(Event.HttpServerEvents.EXCEPTION, event);

        // A listener might have replaced the exception
        e = event.exception;
        if (! event.hasResponse()) {
            await this._dispatcher.dispatch(Event.HttpServerEvents.FINISH_REQUEST, new Event.FinishRequestEvent(this, request));

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
            return await this._filterResponse(response, request);
        } catch (e) {
            return response;
        }
    }

    /**
     * Gets the request scheme.
     *
     * @param {Object} headers
     *
     * @returns {string}
     *
     * @protected
     */
    _getScheme(headers) {
        if (headers['sec-websocket-key']) {
            return 'ws';
        }

        return 'http';
    }

    /**
     * Filters a response object.
     *
     * @param {Jymfony.Component.HttpFoundation.Response} response
     * @param {Jymfony.Component.HttpFoundation.Request} request
     *
     * @returns {Promise<Jymfony.Component.HttpFoundation.Response>}
     *
     * @private
     */
    async _filterResponse(response, request) {
        const event = new Event.FilterResponseEvent(this, request, response);
        await this._dispatcher.dispatch(Event.HttpServerEvents.RESPONSE, event);
        await this._dispatcher.dispatch(Event.HttpServerEvents.FINISH_REQUEST, new Event.FinishRequestEvent(this, request));

        return event.response;
    }
}

module.exports = RequestHandler;
