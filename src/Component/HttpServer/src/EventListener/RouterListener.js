const EventSubscriberInterface = Jymfony.Contracts.EventDispatcher.EventSubscriberInterface;
const NotFoundHttpException = Jymfony.Component.HttpFoundation.Exception.NotFoundHttpException;
const MethodNotAllowedHttpException = Jymfony.Component.HttpFoundation.Exception.MethodNotAllowedHttpException;
const Response = Jymfony.Component.HttpFoundation.Response;
const Events = Jymfony.Component.HttpServer.Event.HttpServerEvents;
const Kernel = Jymfony.Component.Kernel.Kernel;
const NullLogger = Jymfony.Component.Logger.NullLogger;
const MethodNotAllowedException = Jymfony.Component.Routing.Exception.MethodNotAllowedException;
const NoConfigurationException = Jymfony.Component.Routing.Exception.NoConfigurationException;
const ResourceNotFoundException = Jymfony.Component.Routing.Exception.ResourceNotFoundException;

const path = require('path');

/**
 * @memberOf Jymfony.Component.HttpServer.EventListener
 */
class RouterListener extends implementationOf(EventSubscriberInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Routing.Matcher.MatcherInterface} matcher
     * @param {Jymfony.Component.Logger.LoggerInterface} [logger]
     * @param {string} [projectDir = '']
     * @param {boolean} [debug = false]
     */
    __construct(matcher, logger = undefined, projectDir = '', debug = false) {
        /**
         * @type {Jymfony.Component.Routing.Matcher.MatcherInterface}
         *
         * @private
         */
        this._matcher = matcher;

        /**
         * @type {Jymfony.Component.Logger.LoggerInterface}
         *
         * @private
         */
        this._logger = logger || new NullLogger();

        /**
         * @type {string}
         *
         * @private
         */
        this._projectDir = projectDir;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._debug = debug;
    }

    /**
     * Call the router matcher and set attributes into the request object.
     *
     * @param {Jymfony.Component.HttpServer.Event.GetResponseEvent} event
     */
    onRequest(event) {
        const request = event.request;
        if (request.attributes.has('_controller')) {
            return;
        }

        try {
            const parameters = this._matcher.matchRequest(request);
            this._logger.info('Matched route "{route}".', {
                route: parameters['_route'] || 'n/a',
                route_parameters: parameters,
                request_uri: request.uri,
                method: request.method,
            });

            request.attributes.add(parameters);

            delete parameters['_route'];
            delete parameters['_controller'];

            request.attributes.set('_route_params', parameters);
        } catch (e) {
            let message;
            if (e instanceof ResourceNotFoundException) {
                message = __jymfony.sprintf('No route found for "%s %s"', request.method, request.pathInfo);

                const referer = request.headers.get('referer');
                if (referer) {
                    message += __jymfony.sprintf(' (from "%s")', referer);
                }

                throw new NotFoundHttpException(message, e);
            } else if (e instanceof MethodNotAllowedException) {
                message = __jymfony.sprintf('No route found for "%s %s": Method Not Allowed (Allow: %s)', request.method, request.pathInfo, e.allowedMethods.join(', '));

                throw new MethodNotAllowedHttpException(e.allowedMethods, message, e);
            } else {
                throw e;
            }
        }
    }

    /**
     * Handles NoConfigurationException displaying a welcome page
     * if debug is enabled.
     *
     * @param {Jymfony.Component.HttpServer.Event.GetResponseForExceptionEvent} event
     */
    onException(event) {
        const e = event.exception;
        if (! this._debug || ! (e instanceof NotFoundHttpException)) {
            return;
        }

        if (e.previous instanceof NoConfigurationException) {
            event.response = this._createWelcomePage();
        }
    }

    /**
     * @inheritdoc
     */
    static getSubscribedEvents() {
        return {
            [Events.REQUEST]: [ 'onRequest', 32 ],
            [Events.EXCEPTION]: [ 'onException', -64 ],
        };
    }

    /**
     * Renders a welcome page.
     *
     * @returns {Jymfony.Component.HttpFoundation.Response}
     *
     * @private
     */
    _createWelcomePage() {
        const welcome = require(__dirname + '/../Resources/welcome.html.js');

        return new Response(welcome(Kernel.VERSION, this._projectDir + path.sep), Response.HTTP_NOT_FOUND, {
            'Content-Type': 'text/html',
        });
    }
}

module.exports = RouterListener;
