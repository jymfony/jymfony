const EventDispatcher = Jymfony.Component.EventDispatcher.EventDispatcher;
const FunctionControllerResolver = Jymfony.Component.HttpFoundation.Controller.FunctionControllerResolver;
const BadRequestException = Jymfony.Component.HttpFoundation.Exception.BadRequestException;
const Request = Jymfony.Component.HttpFoundation.Request;
const Response = Jymfony.Component.HttpFoundation.Response;
const Event = Jymfony.Component.HttpServer.Event;
const EventListener = Jymfony.Component.HttpServer.EventListener;
const RequestHandler = Jymfony.Component.HttpServer.RequestHandler;
const Router = Jymfony.Component.Routing.Router;
const FunctionLoader = Jymfony.Component.Routing.Loader.FunctionLoader;

const Readable = require('stream').Readable;
const url = require('url');

/**
 * @typedef {Object} AwsLambdaEvent API Gateway Lambda Proxy Input Format
 * @property {string} resource Resource path.
 * @property {string} path Path parameter.
 * @property {string} httpMethod Incoming request's method name.
 * @property {Object} headers Incoming request headers.
 * @property {Object} queryStringParameters query string parameters.
 * @property {Object} pathParameters path parameters.
 * @property {Object} stageVariables Applicable stage variables.
 * @property {Object} requestContext Request context, including authorizer-returned key-value pairs, requestId, sourceIp, etc.
 * @property {Object} body A JSON string of the request payload.
 * @property {boolean} isBase64Encoded A boolean flag to indicate if the applicable request payload is Base64-encode
 */

/**
 * @typedef {Object} AwsLambdaContext API Gateway Lambda Proxy context
 * @param {string} logGroupName Cloudwatch Log Group name
 * @param {string} logStreamName Cloudwatch Log stream name.
 * @param {string} functionName Lambda function name.
 * @param {string} memoryLimitInMB Function memory.
 * @param {string} functionVersion Function version identifier.
 * @param {Function} getRemainingTimeInMillis Time in milliseconds before function times out.
 * @param {string} awsRequestId Lambda request ID.
 * @param {string} invokedFunctionArn Function ARN.
 */

/**
 * @memberOf Jymfony.Component.HttpServer.Serverless
 */
class AwsLambdaHandler extends RequestHandler {
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
     * Handles an incoming request from the http server.
     *
     * @param {AwsLambdaEvent} event
     * @param {AwsLambdaContext} context
     *
     * @returns {Promise<Object>}
     */
    async handleEvent(event, context) {
        try {
            return await this._handleRequest(event, context);
        } catch (e) {
            this._logger.error('Error while processing request: ' + e.message, {
                exception: e,
                event,
                context,
            });

            return {
                statusCode: 500,
                headers: {
                    'Content-type': 'text/plain',
                },
                body: 'Unknown error while handling your request.',
            };
        }
    }

    /**
     * Converts an IncomingMessage to an HttpFoundation request
     * and sends it to the Kernel.
     *
     * @param {AwsLambdaEvent} event
     * @param {AwsLambdaContext} context
     *
     * @returns {Promise<Object>}
     *
     * @protected
     */
    async _handleRequest(event, context) { // eslint-disable-line no-unused-vars
        const headers = new Jymfony.Component.HttpFoundation.HeaderBag(event.headers || {});
        const contentType = headers.get('content-type', 'application/x-www-form-urlencoded');
        let requestParams, content;

        try {
            [ requestParams, content ] = await this._parseRequestContent(event, headers, contentType);
        } catch (e) {
            if (e instanceof BadRequestException) {
                return {
                    statusCode: 200,
                    headers: {
                        'Content-type': 'text/plain',
                    },
                };
            }

            return {
                statusCode: 500,
                headers: {
                    'Content-type': 'text/plain',
                },
            };
        }

        const requestUrl = url.format({ pathname: event.path, query: event.queryStringParameters });
        const request = new Request(requestUrl, requestParams, {}, event.headers || {}, {
            'REQUEST_METHOD': event.httpMethod,
            'REMOTE_ADDR': event.requestContext.identity.sourceIp,
            'SCHEME': this._getScheme(headers.all),
            'SERVER_NAME': headers.get('Host'),
            'SERVER_PORT': headers.get('x-forwarded-port'),
            'SERVER_PROTOCOL': 'HTTP/1.1',
        }, content);

        let response = await this.handle(request);
        if (response instanceof Promise) {
            response = await response;
        }

        await response.prepare(request);

        content = null;
        if (! response.isEmpty && response.content) {
            content = isFunction(response.content) ? await response.content(new __jymfony.StreamBuffer()) : response.content;
        }

        const responseHeaders = {};
        for (const hdr of response.headers.keys) {
            responseHeaders[hdr] = response.headers.get(hdr);
        }

        const result = {
            statusCode: response.statusCode,
            headers: responseHeaders,
            body: content,
        };

        const postResponseEvent = new Event.PostResponseEvent(this, request, response);
        await this._dispatcher.dispatch(Event.HttpServerEvents.TERMINATE, postResponseEvent);

        return result;
    }

    /**
     * @inheritdoc
     */
    async _parseRequestContent(request, headers, contentType) {
        if (headers['sec-websocket-key']) {
            return [ {}, undefined ];
        }

        const stream = new Readable();
        stream.push(request.isBase64Encoded ? atob(request.body) : request.body);
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
}

module.exports = AwsLambdaHandler;
