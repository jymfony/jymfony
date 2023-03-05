const StoppableEventInterface = Jymfony.Contracts.EventDispatcher.StoppableEventInterface;

/**
 * @memberOf Jymfony.Component.EventDispatcher.Debug
 */
export default class WrappedListener {
    /**
     * Constructor
     *
     * @param {Function} listener
     * @param {string} eventName
     * @param {Jymfony.Contracts.Stopwatch.StopwatchInterface} stopwatch
     * @param {Jymfony.Contracts.EventDispatcher.EventDispatcherInterface} dispatcher
     */
    __construct(listener, eventName, stopwatch, dispatcher) {
        /**
         * @type {Object}
         *
         * @private
         */
        this._listener = listener;

        /**
         * @type {Jymfony.Contracts.EventDispatcher.EventDispatcherInterface}
         *
         * @private
         */
        this._dispatcher = dispatcher;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._called = false;

        /**
         * @type {Jymfony.Contracts.Stopwatch.StopwatchInterface}
         *
         * @private
         */
        this._stopwatch = stopwatch;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._stoppedPropagation = false;

        /**
         * @type {string}
         *
         * @private
         */
        this._name = 'Function';

        /**
         * @type {string}
         *
         * @private
         */
        this._pretty = 'Function';

        /**
         * @type {int | null}
         *
         * @private
         */
        this._priority = null;

        if (isCallableArray(listener)) {
            this._name = (new ReflectionClass(listener[0])).name;
            this._pretty = this._name + '.' + listener[1];
        }
    }

    /**
     * @returns {Object}
     */
    get wrappedListener() {
        return this._listener;
    }

    /**
     * @returns {boolean}
     */
    get wasCalled() {
        return this._called;
    }

    /**
     * @returns {boolean}
     */
    get stoppedPropagation() {
        return this._stoppedPropagation;
    }

    /**
     * @returns {string}
     */
    get pretty() {
        return this._pretty;
    }

    async __invoke(event, eventName, dispatcher) {
        dispatcher = this._dispatcher || dispatcher;

        this._called = true;
        this._priority = dispatcher.getListenerPriority(eventName, this._listener);

        const e = this._stopwatch.start(this._name, 'event_listener');
        await this._listener(event, eventName, dispatcher);

        if (e.isStarted()) {
            e.stop();
        }

        if (event instanceof StoppableEventInterface && event.isPropagationStopped()) {
            this._stoppedPropagation = true;
        }
    }

    getInfo(eventName) {
        return {
            event: eventName,
            priority: null !== this._priority ? this._priority : (null !== this._dispatcher ? this._dispatcher.getListenerPriority(eventName, this._listener) : null),
            pretty: this._pretty,
        };
    }
}
