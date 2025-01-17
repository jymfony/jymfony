const DebugLoggerInterface = Jymfony.Component.Kernel.Log.DebugLoggerInterface;
const EventSubscriberInterface = Jymfony.Contracts.EventDispatcher.EventSubscriberInterface;
const Events = Jymfony.Component.HttpServer.Event.HttpServerEvents;
const HttpExceptionInterface = Jymfony.Component.HttpFoundation.Exception.HttpExceptionInterface;
const NotFoundHttpException = Jymfony.Component.HttpFoundation.Exception.NotFoundHttpException;
const NullLogger = Jymfony.Contracts.Logger.NullLogger;
const Request = Jymfony.Component.HttpFoundation.Request;

/**
 * @memberOf Jymfony.Component.HttpServer.EventListener
 */
export default class ExceptionListener extends implementationOf(EventSubscriberInterface) {
    /**
     * Constructor.
     *
     * @param {Function|string} controller
     * @param {Jymfony.Contracts.Logger.LoggerInterface} [logger]
     * @param {boolean} [debug = false]
     */
    __construct(controller, logger = undefined, debug = false) {
        /**
         * @type {Function|string}
         *
         * @private
         */
        this._controller = controller;

        /**
         * @type {Jymfony.Contracts.Logger.LoggerInterface}
         *
         * @private
         */
        this._logger = logger || new NullLogger();

        /**
         * @type {boolean}
         *
         * @private
         */
        this._debug = debug;
    }

    /**
     * Gets a response for a given exception.
     *
     * @param {Jymfony.Contracts.HttpServer.Event.ExceptionEvent} event
     * @param {string} eventName
     * @param {Jymfony.Contracts.EventDispatcher.EventDispatcherInterface} eventDispatcher
     *
     * @returns {Promise<void>}
     */
    async onException(event, eventName, eventDispatcher) {
        const exception = event.exception;
        let request = event.request;

        let exceptionClass = exception.constructor.name;
        try {
            exceptionClass = new ReflectionClass(exception).name || exceptionClass;
        } catch { }

        if (! (exception instanceof NotFoundHttpException)) {
            this._logException(exception, __jymfony.sprintf('Uncaught Exception %s: "%s"', exceptionClass, exception.message));
        }

        let response;
        request = this._duplicateRequest(exception, request);

        try {
            response = await event.server.handle(request, false);
        } catch (e) {
            this._logException(e, __jymfony.sprintf('Exception thrown when handling an exception (%s)', e.constructor.name));

            throw e;
        }

        event.response = response;

        if (this._debug) {
            const cspRemoval = event => {
                event.response.headers.remove('Content-Security-Policy');
                eventDispatcher.removeListener(Events.RESPONSE, cspRemoval);
            };

            eventDispatcher.addListener(Events.RESPONSE, cspRemoval);
        }
    }

    /**
     * @inheritdoc
     */
    static getSubscribedEvents() {
        return {
            [Events.EXCEPTION]: [ 'onException', -128 ],
        };
    }

    /**
     * Logs an exception
     *
     * @param {Exception|Error} exception
     * @param {string} message
     *
     * @protected
     */
    _logException(exception, message) {
        if (! (exception instanceof HttpExceptionInterface) || 500 <= exception.statusCode) {
            this._logger.critical(message, { exception: exception });
        } else {
            this._logger.error(message, { exception: exception });
        }
    }

    /**
     * Clones the request for the exception.
     *
     * @param {Error} exception The thrown exception
     * @param {Jymfony.Component.HttpFoundation.Request} request The original request
     *
     * @returns {Jymfony.Component.HttpFoundation.Request} The cloned request
     *
     * @protected
     */
    _duplicateRequest(exception, request) {
        const attributes = {
            exception,
            '_controller': this._controller,
            'logger': this._logger instanceof DebugLoggerInterface ? this._logger : null,
            [Request.ATTRIBUTE_PARENT_REQUEST]: request,
        };

        request = request.duplicate(undefined, undefined, attributes);
        request.method = Request.METHOD_GET;

        return request;
    }
}
