const EventDispatcher = Jymfony.Component.EventDispatcher.EventDispatcher;
const FunctionControllerResolver = Jymfony.Component.HttpFoundation.Controller.FunctionControllerResolver;
const BadRequestException = Jymfony.Component.HttpFoundation.Exception.BadRequestException;
const ContentType = Jymfony.Component.HttpFoundation.Header.ContentType;
const Request = Jymfony.Component.HttpFoundation.Request;
const Response = Jymfony.Component.HttpFoundation.Response;
const Event = Jymfony.Component.HttpServer.Event;
const EventListener = Jymfony.Component.HttpServer.EventListener;
const RequestHandler = Jymfony.Component.HttpServer.RequestHandler;
const Router = Jymfony.Component.Routing.Router;
const FunctionLoader = Jymfony.Component.Routing.Loader.FunctionLoader;

const http = require('http');

/**
 * @memberOf Jymfony.Component.HttpServer
 */
class HttpServer extends RequestHandler {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.EventDispatcher.EventDispatcherInterface} dispatcher
     * @param {Jymfony.Component.HttpFoundation.Controller.ControllerResolverInterface} resolver
     */
    __construct(dispatcher, resolver) {
        super.__construct(dispatcher, resolver);

        /**
         * @type {http.Server}
         *
         * @protected
         */
        this._http = this._createServer();

        /**
         * @type {string|undefined}
         *
         * @protected
         */
        this._host = undefined;

        /**
         * @type {string|undefined}
         *
         * @protected
         */
        this._port = undefined;
    }

    /**
     * Creates a new Http server instance.
     *
     * @param {Jymfony.Component.Routing.RouteCollection} routes
     * @param {Jymfony.Component.Logger.LoggerInterface} logger
     *
     * @returns {Jymfony.Component.HttpServer.HttpServer}
     */
    static create(routes, logger = undefined) {
        const router = new Router(new FunctionLoader(), () => routes);
        const eventDispatcher = new EventDispatcher();
        eventDispatcher.addSubscriber(new EventListener.RouterListener(router));
        eventDispatcher.addSubscriber(new EventListener.ExceptionListener(
            (request) => {
                return new Response(JSON.stringify(request.attributes.get('exception')), Response.HTTP_OK, {
                    'content-type': 'application/json',
                });
            })
        );

        const server = new __self(eventDispatcher, new FunctionControllerResolver(logger));
        if (logger !== undefined) {
            server.setLogger(logger);
        }

        return server;
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

            this._http.on('close', () => {
                this._host = undefined;
                this._port = undefined;

                resolve();
            });

            this._http.on('upgrade', (request, socket) => {
                socket.writeHead = (statusCode, reason = undefined, obj = undefined) => {
                    if (! isString(reason)) {
                        obj = reason;
                        reason = Response.statusTexts[statusCode];
                    }

                    statusCode |= 0;
                    if (100 > statusCode || 999 < statusCode) {
                        throw new RangeError(`Invalid status code: ${statusCode}`);
                    }

                    socket.write('HTTP/1.1 ' + statusCode.toString() + ' ' + reason + '\r\n');
                    for (const [ key, value ] of __jymfony.getEntries(obj || {})) {
                        if (! isArray(value)) {
                            socket.write(key + ': ' + value + '\r\n');
                        } else {
                            value.forEach(v => socket.write(key + ': ' + v + '\r\n'));
                        }
                    }

                    socket.write('\r\n');
                };

                return this._incomingRequest(request, socket);
            });

            if (!! path) {
                this._http.listen({ path });
            } else {
                this._host = host;
                this._port = port;
                this._http.listen({ host, port });
            }

            this._logger.debug('Http server listening on '+(path || host + ':' + port));
        });
    }

    /**
     * Closes the server.
     *
     * @returns {Promise<void>}
     */
    async close() {
        if (! this._http.listening) {
            return;
        }

        await this._dispatcher.dispatch(Event.HttpServerEvents.SERVER_TERMINATE);
        this._http.close();
    }

    /**
     * Creates a new http server.
     *
     * @returns {http.Server}
     *
     * @protected
     */
    _createServer() {
        const server = new http.Server(this._incomingRequest.bind(this));
        server.on('clientError',
            /**
             * @param {Error} err
             * @param {module:net.Socket} socket
             *
             * @returns {Promise<void>}
             */
            async (err, socket) => {
                try {
                    if (! err) {
                        return;
                    }

                    let status = Response.HTTP_BAD_REQUEST;
                    let message = 'Unexpected error on HTTP request';

                    if ('HPE_INVALID_METHOD' === err.code) {
                        status = Response.HTTP_METHOD_NOT_ALLOWED;
                        message = 'Unsupported HTTP method';
                    }

                    let response = 'HTTP/1.1 ' + status + ' ' + Response.statusTexts[status] + '\r\n';
                    response += 'Content-Type: text/plain' + '\r\n';
                    response += 'Content-Length: ' + message.length + '\r\n';
                    response += '\r\n';
                    response += message;

                    await new Promise(resolve => socket.write(response, 'UTF-8', resolve));
                } catch (e) {
                    // Do nothing.
                } finally {
                    socket.end();
                }
            });

        return server;
    }

    /**
     * Handles an incoming request from the http server.
     *
     * @param {IncomingMessage} req
     * @param {ServerResponse} res
     *
     * @returns {Promise<void>}
     *
     * @private
     */
    async _incomingRequest(req, res) {
        try {
            await this._handleRequest(req, res);
        } catch (e) {
            if (! res.finished) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.write('Unknown error while handling your request.\r\n');
                res.end();
            }

            this._logger.error('Error while processing request: ' + e.message, {
                exception: e,
                request: req,
            });
        }
    }

    /**
     * Converts an IncomingMessage to an HttpFoundation request
     * and sends it to the Kernel.
     *
     * @param {IncomingMessage} req
     * @param {ServerResponse} res
     *
     * @returns {Promise<void>}
     *
     * @protected
     */
    async _handleRequest(req, res) {
        res.on('error', (err) => {
            this._logger.error('Request encountered an error', { exception: err });
        });

        const contentType = new ContentType(req.headers['content-type'] || 'application/x-www-form-urlencoded');
        let requestParams, content;

        try {
            [ requestParams, content ] = await this._parseRequestContent(req, req.headers, contentType);
        } catch (e) {
            if (e instanceof BadRequestException) {
                res.writeHead(400, {'Content-Type': 'text/plain'});
            } else {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                this._logger.error('Error while parsing request content: '+e.message, {
                    exception: e,
                    request: req,
                });
            }

            res.end();
            return;
        }

        const request = new Request(req.url, requestParams, {}, req.headers, {
            'REQUEST_METHOD': req.method,
            'REMOTE_ADDR': req.connection.remoteAddress,
            'SCHEME': this._getScheme(req.headers),
            'SERVER_NAME': this._host,
            'SERVER_PORT': this._port,
            'SERVER_PROTOCOL': 'HTTP/'+req.httpVersion,
        }, content);

        let response = await this.handle(request);
        if (response instanceof Promise) {
            response = await response;
        }

        await response.prepare(request);
        await response.sendResponse(req, res);

        const event = new Event.PostResponseEvent(this, request, response);
        await this._dispatcher.dispatch(Event.HttpServerEvents.TERMINATE, event);
    }
}

module.exports = HttpServer;
