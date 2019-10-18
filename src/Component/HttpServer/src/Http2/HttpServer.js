import * as http2 from 'http2';
import { readFileSync } from 'fs';

const BaseServer = Jymfony.Component.HttpServer.HttpServer;
const EventDispatcher = Jymfony.Component.EventDispatcher.EventDispatcher;
const FunctionControllerResolver = Jymfony.Component.HttpFoundation.Controller.FunctionControllerResolver;
const BadRequestException = Jymfony.Component.HttpFoundation.Exception.BadRequestException;
const ContentType = Jymfony.Component.HttpFoundation.Header.ContentType;
const Request = Jymfony.Component.HttpFoundation.Request;
const Response = Jymfony.Component.HttpFoundation.Response;
const HttpServerEvents = Jymfony.Component.HttpServer.Event.HttpServerEvents;
const EventListener = Jymfony.Component.HttpServer.EventListener;
const Router = Jymfony.Component.Routing.Router;
const FunctionLoader = Jymfony.Component.Routing.Loader.FunctionLoader;
const Event = Jymfony.Contracts.HttpServer.Event;

const {
    HTTP2_HEADER_AUTHORITY,
    HTTP2_HEADER_CONTENT_TYPE,
    HTTP2_HEADER_METHOD,
    HTTP2_HEADER_PATH,
    HTTP2_HEADER_PROTOCOL,
    HTTP2_HEADER_SCHEME,
    HTTP2_HEADER_STATUS,
} = http2.constants;

/**
 * @memberOf Jymfony.Component.HttpServer.Http2
 */
export default class HttpServer extends BaseServer {
    /**
     * Constructor.
     *
     * @param {Jymfony.Contracts.EventDispatcher.EventDispatcherInterface} dispatcher
     * @param {Jymfony.Component.HttpFoundation.Controller.ControllerResolverInterface} resolver
     * @param {Object} serverOptions
     */
    __construct(dispatcher, resolver, serverOptions = {}) {
        /**
         * @type {Object}
         *
         * @private
         */
        this._options = serverOptions;

        super.__construct(dispatcher, resolver);
    }

    /**
     * Creates a new Http server instance.
     *
     * @param {Jymfony.Component.Routing.RouteCollection} routes
     * @param {Object} options
     * @param {Jymfony.Component.Logger.LoggerInterface} logger
     *
     * @returns {Jymfony.Component.HttpServer.HttpServer}
     */
    static create(routes, options = {}, logger = undefined) {
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

        const server = new __self(eventDispatcher, new FunctionControllerResolver(logger), options);
        if (logger !== undefined) {
            server.setLogger(logger);
        }

        return server;
    }

    /**
     * @inheritdoc
     */
    get scheme() {
        return 'https';
    }

    /**
     * @inheritdoc
     */
    _createServer() {
        const options = Object.assign({
            allowHTTP1: true,
            enablePush: true,
            enableConnectProtocol: true,
        }, this._options);

        if (isString(options.key)) {
            options.key = readFileSync(options.key);
        }

        if (isString(options.cert)) {
            options.cert = readFileSync(options.cert);
        }

        const server = http2.createSecureServer(options, this._incomingRequest.bind(this));
        server.on('stream', this._incomingStream.bind(this));

        return server;
    }

    /**
     * Converts an IncomingMessage to an HttpFoundation request
     * and sends it to the Kernel.
     *
     * @param {ServerHttp2Stream} stream
     * @param {Object} headers
     *
     * @returns {Promise<void>}
     *
     * @protected
     */
    async _handleRequest(stream, headers) {
        stream.on('error', (err) => {
            this._logger.error('Request encountered an error', { exception: err });
        });

        const contentType = new ContentType(headers[HTTP2_HEADER_CONTENT_TYPE] || 'application/x-www-form-urlencoded');
        let requestParams, content;

        try {
            [ requestParams, content ] = await this._parseRequestContent(stream, headers, contentType);
        } catch (e) {
            if (e instanceof BadRequestException) {
                stream.respond({ [HTTP2_HEADER_STATUS]: 400, [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain' });
            } else {
                stream.respond({ [HTTP2_HEADER_STATUS]: 500, [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain' });
                this._logger.error('Error while parsing request content: '+e.message, {
                    exception: e,
                    request: stream,
                });
            }

            stream.end();
            return;
        }

        const scheme = this._getScheme(headers);
        const path = headers[HTTP2_HEADER_PATH];
        const authority = headers[HTTP2_HEADER_AUTHORITY];

        const socket = stream.session.socket;
        const request = new Request(scheme+'://'+authority+path, requestParams, {}, headers, {
            'REQUEST_METHOD': headers[HTTP2_HEADER_METHOD],
            'REMOTE_ADDR': socket.remoteAddress,
            'SCHEME': scheme,
            'SERVER_NAME': this._host,
            'SERVER_PORT': this._port,
            'SERVER_PROTOCOL': 'HTTP/2',
        }, content);

        let response = await this.handle(request);
        if (response instanceof Promise) {
            response = await response;
        }

        await response.prepare(request);
        await response.sendResponse(stream, stream);

        const event = new Event.PostResponseEvent(this, request, response);
        await this._dispatcher.dispatch(HttpServerEvents.POST_RESPONSE, event);
    }

    /**
     * Gets the request scheme.
     *
     * @param {Object} headers
     *
     * @returns {string}
     */
    _getScheme(headers) {
        if (! headers[HTTP2_HEADER_SCHEME]) {
            // HTTP1 request has been passed as argument.
            return super._getScheme(headers);
        }

        const scheme = headers[HTTP2_HEADER_SCHEME];

        return 'websocket' === headers[HTTP2_HEADER_PROTOCOL] ?
            ('https' === scheme ? 'wss' : 'ws') :
            scheme;
    }

    /**
     * Handles an incoming request from the http server.
     * This allows http1 compatibility.
     *
     * @param {IncomingMessage} req
     * @param {ServerResponse} res
     *
     * @returns {Promise<void>}
     *
     * @protected
     */
    async _incomingRequest(req, res) {
        if (__jymfony.version_compare(req.httpVersion, '2.0', '>=')) {
            return;
        }

        try {
            await super._handleRequest(req, res);
        } catch (e) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.write('Unknown error while handling your request.\r\n');
            res.end();

            this._logger.error('Error while processing request: ' + e.message, {
                exception: e,
                request: req,
            });
        }
    }

    /**
     * Handles an incoming request from the http server.
     *
     * @param {ServerHttp2Stream} stream
     * @param {Object} headers
     *
     * @returns {Promise<void>}
     *
     * @private
     */
    async _incomingStream(stream, headers) {
        try {
            await this._handleRequest(stream, headers);
        } catch (e) {
            stream.respond({
                [HTTP2_HEADER_STATUS]: 500,
                [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain',
            });
            stream.write('Unknown error while handling your request.\r\n');
            stream.end();

            this._logger.error('Error while processing request: ' + e.message, {
                exception: e,
                request: stream,
            });
        }
    }
}

module.exports = HttpServer;
