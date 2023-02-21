const MiddlewareInterface = Jymfony.Component.Messenger.Middleware.MiddlewareInterface;
const StackInterface = Jymfony.Component.Messenger.Middleware.StackInterface;

/**
 * Collects some data about a middleware.
 *
 * @memberOf Jymfony.Component.Messenger.Middleware
 */
export default class TraceableMiddleware extends implementationOf(MiddlewareInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Contracts.Stopwatch.StopwatchInterface} stopwatch
     * @param {string} busName
     * @param {string} [eventCategory = 'messenger.middleware']
     */
    __construct(stopwatch, busName, eventCategory = 'messenger.middleware') {
        /**
         * @type {Jymfony.Contracts.Stopwatch.StopwatchInterface}
         *
         * @private
         */
        this._stopwatch = stopwatch;

        /**
         * @type {string}
         *
         * @private
         */
        this._busName = busName;

        /**
         * @type {string}
         *
         * @private
         */
        this._eventCategory = eventCategory;
    }

    /**
     * {@inheritdoc}
     */
    handle(envelope, stack) {
        stack = new TraceableStack(stack, this._stopwatch, this._busName, this._eventCategory);

        try {
            return stack.next().handle(envelope, stack);
        } finally {
            stack.stop();
        }
    }
}

/**
 * @internal
 */
class TraceableStack extends implementationOf(StackInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Messenger.Middleware.StackInterface} stack
     * @param {Jymfony.Contracts.Stopwatch.StopwatchInterface} stopwatch
     * @param {string} busName
     * @param {string} eventCategory
     */
    __construct(stack, stopwatch, busName, eventCategory) {
        /**
         * @type {Jymfony.Component.Messenger.Middleware.StackInterface}
         *
         * @private
         */
        this._stack = stack;

        /**
         * @type {Jymfony.Contracts.Stopwatch.StopwatchInterface}
         *
         * @private
         */
        this._stopwatch = stopwatch;

        /**
         * @type {string}
         *
         * @private
         */
        this._busName = busName;

        /**
         * @type {string}
         *
         * @private
         */
        this._eventCategory = eventCategory;

        /**
         * @type {null | string}
         *
         * @private
         */
        this._currentEvent = null;
    }

    /**
     * @inheritdoc
     */
    next() {
        if (null !== this._currentEvent && this._stopwatch.isStarted(this._currentEvent)) {
            this._stopwatch.stop(this._currentEvent);
        }

        const nextMiddleware = this._stack.next();
        if (this._stack === nextMiddleware) {
            this._currentEvent = 'Tail';
        } else {
            this._currentEvent = __jymfony.sprintf('"%s"', __jymfony.get_debug_type(nextMiddleware));
        }

        this._currentEvent += __jymfony.sprintf(' on "%s"', this._busName);
        this._stopwatch.start(this._currentEvent, this._eventCategory);

        return nextMiddleware;
    }

    stop() {
        if (null !== this._currentEvent && this._stopwatch.isStarted(this._currentEvent)) {
            this._stopwatch.stop(this._currentEvent);
        }

        this._currentEvent = null;
    }
}
