import { Readable } from 'node:stream';

const EventDispatcher = Jymfony.Component.EventDispatcher.EventDispatcher;
const FunctionControllerResolver = Jymfony.Component.HttpFoundation.Controller.FunctionControllerResolver;
const BadRequestException = Jymfony.Component.HttpFoundation.Exception.BadRequestException;
const ContentType = Jymfony.Component.HttpFoundation.Header.ContentType;
const Request = Jymfony.Component.HttpFoundation.Request;
const Response = Jymfony.Component.HttpFoundation.Response;
const EventListener = Jymfony.Component.HttpServer.EventListener;
const RequestHandler = Jymfony.Component.HttpServer.RequestHandler;
const Router = Jymfony.Component.Routing.Router;
const FunctionLoader = Jymfony.Component.Routing.Loader.FunctionLoader;
const Event = Jymfony.Contracts.HttpServer.Event;
const HttpServerEvents = Jymfony.Component.HttpServer.Event.HttpServerEvents;

/**
 * @memberOf Jymfony.Component.HttpServer.Serverless
 */
export default class AwsLambdaHandler extends RequestHandler {
    /**
     * Creates a new Http server instance.
     *
     * @param {Jymfony.Component.Routing.RouteCollection} routes
     * @param {Jymfony.Contracts.Logger.LoggerInterface} logger
     *
     * @returns {Jymfony.Component.HttpServer.Serverless.AwsLambdaHandler}
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
     * Handles an incoming request from the http server.
     *
     * @param {APIGatewayProxyEvent|ALBEvent} event
     * @param {NodeJS.WritableStream|Context} streamOrContext
     * @param {Context|undefined} context
     *
     * @returns {Promise<APIGatewayProxyResult|ALBResult>}
     */
    async handleEvent(event, streamOrContext, context) {
        if (streamOrContext !== undefined && !isFunction(streamOrContext?.write)) {
            context = streamOrContext;
            streamOrContext = undefined;
        }

        try {
            return await this._handleRequest(event, context, streamOrContext);
        } catch (e) {
            this._logger.error('Error while processing request: ' + e.message, {
                exception: e,
                event,
                context,
            });

            const response = {
                statusCode: 500,
                headers: {
                    'Content-type': 'text/plain',
                },
                body: 'Unknown error while handling your request.',
            };

            if (event.requestContext.elb) {
                response.statusDescription = '500 Internal Server Error';
            }

            return response;
        }
    }

    /**
     * Converts an IncomingMessage to an HttpFoundation request
     * and sends it to the Kernel.
     *
     * @param {APIGatewayProxyEvent|ALBEvent} event
     * @param {Context} context
     * @param {LambdaResponseStream|undefined} responseStream
     *
     * @returns {Promise<APIGatewayProxyResult|ALBResult>}
     *
     * @protected
     */
    async _handleRequest(event, context, responseStream) { // eslint-disable-line no-unused-vars
        const headers = new Jymfony.Component.HttpFoundation.HeaderBag(event.headers || {});
        const normalizedHeaders = headers.keys.reduce((res, key) => (res[key] = headers.get(key), res), {});
        const contentType = new ContentType(headers.get('content-type', 'application/x-www-form-urlencoded'));

        let requestParams, content;
        try {
            [ requestParams, content ] = await this._parseRequestContent(event, normalizedHeaders, contentType);
        } catch (e) {
            const response = {
                statusCode: 500,
                headers: {
                    'Content-type': 'text/plain',
                },
                body: e.message,
            };

            if (e instanceof BadRequestException) {
                response.statusCode = 400;
            }

            if (event.requestContext.elb) {
                response.statusDescription = response.statusCode + ' ' + (Response.statusTexts[response.statusCode] || 'Unknown');
            }

            return response;
        }

        const requestUrl = (() => {
            const url = new URL('https://' + (event.requestContext.domainName || 'localhost') + '/');
            url.pathname = event.rawPath || event.path;
            url.search = undefined !== event.rawQueryString ? event.rawQueryString : new URLSearchParams(event.queryStringParameters).toString();

            return url.href;
        })();

        const sourceIp = event.requestContext && event.requestContext.identity ? event.requestContext.identity.sourceIp : undefined;
        const httpMethod = (() => {
            if (event.requestContext) {
                if (event.requestContext.http && event.requestContext.http.method) {
                    return event.requestContext.http.method;
                }

                if (event.requestContext.httpMethod) {
                    return event.requestContext.httpMethod;
                }
            }

            return event.httpMethod;
        })();
        const request = new Request(requestUrl, requestParams, {}, event.headers || {}, {
            'REQUEST_METHOD': httpMethod,
            'REMOTE_ADDR': sourceIp || '127.0.0.1',
            'SCHEME': this._getScheme(headers.all),
            'SERVER_NAME': headers.get('Host'),
            'SERVER_PORT': headers.get('x-forwarded-port'),
            'SERVER_PROTOCOL': 'HTTP/1.1',
        }, content);

        // Do not compress response.
        request.headers.remove('accept-encoding');

        let response = await this.handle(request);
        if (response instanceof Promise) {
            response = await response;
        }

        await response.prepare(request);

        if (undefined === responseStream) {
            return this._handleBufferedResponse(request, response, event);
        }

        return this._handleStreamedResponse(request, response, event, responseStream);
    }

    /**
     * @inheritdoc
     */
    async _parseRequestContent(request, headers, contentType) {
        if (headers['sec-websocket-key']) {
            return [ {}, undefined ];
        }

        const body = request.body && request.isBase64Encoded ? Buffer.from(request.body, 'base64') : (request.body || '');
        headers['content-length'] = headers['content-length'] || body.length;

        const stream = new Readable();
        stream.push(body);
        stream.push(null);

        return await super._parseRequestContent(stream, headers, contentType);
    }

    /**
     * @inheritdoc
     */
    _getScheme(headers) {
        if (headers['cloudfront-forwarded-proto']) {
            return headers['cloudfront-forwarded-proto'][0];
        }

        return super._getScheme(headers);
    }

    /**
     * Prepare streaming response object.
     *
     * @param {Jymfony.Component.HttpFoundation.Request} request
     * @param {Jymfony.Component.HttpFoundation.Response} response
     * @param {APIGatewayProxyEvent|ALBEvent} event
     * @param {LambdaResponseStream} responseStream
     *
     * @returns {Promise<void>}
     *
     * @private
     */
    async _handleStreamedResponse(request, response, event, responseStream) {
        responseStream.setContentType('application/vnd.awslambda.http-integration-response');

        let content = null;
        if (! response.isEmpty && response.content) {
            content = response.content;
            if (!isFunction(content)) {
                const buf = new __jymfony.StreamBuffer(Buffer.from(content));
                content = stream => {
                    stream.write(buf.buffer);
                };
            }
        }

        const { responseHeaders, headersKey } = this._prepareHeaders(event, response);
        const prelude = {
            statusCode: response.statusCode,
            [headersKey]: responseHeaders,
        };

        if (event.requestContext.elb) {
            prelude.statusDescription = prelude.statusCode + ' ' + (Response.statusTexts[prelude.statusCode] || 'Unknown');
        }

        responseStream._onBeforeFirstWrite = write => {
            write(JSON.stringify(prelude));
            write(new Uint8Array(8));
        };

        if (content) {
            await content(responseStream);
        }

        responseStream.end();

        const postResponseEvent = new Event.PostResponseEvent(this, request, response);
        await this._dispatcher.dispatch(postResponseEvent, HttpServerEvents.POST_RESPONSE);

        await responseStream.finished();
    }

    /**
     * Prepare buffered response object.
     *
     * @param {Jymfony.Component.HttpFoundation.Request} request
     * @param {Jymfony.Component.HttpFoundation.Response} response
     * @param {APIGatewayProxyEvent|ALBEvent} event
     *
     * @returns {Promise<APIGatewayProxyResult|ALBResult>}
     *
     * @private
     */
    async _handleBufferedResponse(request, response, event) {
        let content = null;
        let isBase64Encoded = false;
        if (! response.isEmpty && response.content) {
            content = response.content;
            if (isFunction(content)) {
                const buf = new __jymfony.StreamBuffer();
                await content(buf);

                content = buf.buffer.toString('base64');
                isBase64Encoded = true;
            }
        }

        const { responseHeaders, headersKey } = this._prepareHeaders(event, response);
        const result = {
            isBase64Encoded,
            statusCode: response.statusCode,
            [headersKey]: responseHeaders,
            body: content,
        };

        if (event.requestContext.elb) {
            result.statusDescription = result.statusCode + ' ' + (Response.statusTexts[result.statusCode] || 'Unknown');
        }

        const postResponseEvent = new Event.PostResponseEvent(this, request, response);
        await this._dispatcher.dispatch(postResponseEvent, HttpServerEvents.POST_RESPONSE);

        return result;
    }

    /**
     * @param {APIGatewayProxyEvent|ALBEvent} event
     * @param {Jymfony.Component.HttpFoundation.Response} response
     *
     * @returns {{responseHeaders: {}, headersKey: 'multiValueHeaders'|'headers'}}
     *
     * @private
     */
    _prepareHeaders(event, response) {
        const responseHeaders = {};
        const hasMultiHeaders = undefined !== event.multiValueHeaders;
        const headersKey = hasMultiHeaders ? 'multiValueHeaders' : 'headers';

        for (const hdr of response.headers.keys) {
            if (hasMultiHeaders) {
                responseHeaders[hdr] = response.headers.get(hdr, null, false).map(String);
            } else {
                responseHeaders[hdr] = String(response.headers.get(hdr));
            }
        }

        return { responseHeaders, headersKey };
    }
}
