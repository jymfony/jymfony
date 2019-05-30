const TraceableEventDispatcherInterface = Jymfony.Component.EventDispatcher.Debug.TraceableEventDispatcherInterface;
const WrappedListener = Jymfony.Component.EventDispatcher.Debug.WrappedListener;
const Event = Jymfony.Contracts.EventDispatcher.Event;

/**
 * @memberOf Jymfony.Component.EventDispatcher.Debug
 */
class TraceableEventDispatcher extends implementationOf(TraceableEventDispatcherInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Contracts.EventDispatcher.EventDispatcherInterface} dispatcher
     * @param {undefined|Jymfony.Component.Logger.LoggerInterface} [logger]
     */
    __construct(dispatcher, logger = undefined) {
        /**
         * @type {Jymfony.Contracts.EventDispatcher.EventDispatcherInterface}
         *
         * @private
         */
        this._dispatcher = dispatcher;

        /**
         * @type {undefined|Jymfony.Component.Logger.LoggerInterface}
         *
         * @private
         */
        this._logger = logger;

        /**
         * @type {Object.<string, Set<Function>>}
         *
         * @private
         */
        this._called = {};

        return new Proxy(this, {
            get: (target, key) => {
                if (Reflect.has(this, key)) {
                    return Reflect.get(target, key);
                }

                const ret = Reflect.get(this._dispatcher, key);
                if (isFunction(ret)) {
                    return ret.bind(this._dispatcher);
                }

                return ret;
            },
            has: (target, key) => {
                return Reflect.has(this, key) || Reflect.has(this._dispatcher, key);
            },
        });
    }

    /**
     * @inheritdoc
     */
    dispatch(eventName, event = new Event()) {
        if (undefined !== this._logger && event.isPropagationStopped()) {
            this._logger.debug('The "'+eventName+'" event is already stopped. No listeners have been called.');
        }

        this._preProcess(eventName);
        this._preDispatch(eventName, event);

        return (async () => {
            event = await this._dispatcher.dispatch(eventName, event);

            this._postDispatch(eventName, event);
            this._postProcess(eventName);

            return event;
        })();
    }

    /**
     * @inheritdoc
     */
    get calledListeners() {
        const self = this;

        return (function * () {
            for (const [ k, set ] of __jymfony.getEntries(self._called)) {
                yield [ k, new Set(set) ];
            }
        }());
    }

    /**
     * @inheritdoc
     */
    get notCalledListeners() {
        let allListeners;
        const notCalled = new Map();

        try {
            allListeners = Array.from(this.getListeners());
        } catch (e) {
            if (undefined !== this._logger) {
                this._logger.info('An error was thrown while getting the uncalled listeners.', { exception: e });
            }

            return new Map();
        }

        for (const [ eventName, listeners ] of allListeners) {
            for (const listener of listeners) {
                if (this._called[eventName].has(listener)) {
                    break;
                }

                if (! notCalled.has(eventName)) {
                    notCalled.set(eventName, []);
                }

                notCalled[eventName].push(listener);
            }

            if (notCalled.has(eventName)) {
                notCalled.set(eventName, notCalled[eventName].sort((a, b) => {
                    return this._dispatcher.getListenerPriority(eventName, a) - this._dispatcher.getListenerPriority(eventName, b);
                }));
            }
        }

        return notCalled;
    }

    /**
     * Called before dispatching an event.
     *
     * @param {string} eventName
     * @param {Jymfony.Contracts.EventDispatcher.Event} event
     *
     * @protected
     */
    _preDispatch(eventName, event) { } // eslint-disable-line no-unused-vars

    /**
     * Called after dispatching an event.
     *
     * @param {string} eventName
     * @param {Jymfony.Contracts.EventDispatcher.Event} event
     *
     * @protected
     */
    _postDispatch(eventName, event) { } // eslint-disable-line no-unused-vars

    /**
     * Wrap event listeners to track calls.
     *
     * @param {string} eventName
     *
     * @private
     */
    _preProcess(eventName) {
        for (const listener of Array.from(this._dispatcher.getListeners(eventName))) {
            const priority = this._dispatcher.getListenerPriority(eventName, listener);
            const wrapped = new WrappedListener(listener, eventName, this);

            this._dispatcher.removeListener(eventName, listener);
            this._dispatcher.addListener(eventName, wrapped, priority);
        }
    }

    /**
     * Events post-processing.
     *
     * @param {string} eventName
     *
     * @private
     */
    _postProcess(eventName) {
        for (const listener of this._dispatcher.getListeners(eventName)) {
            if (undefined === listener.wasCalled) {
                continue;
            }

            const priority = this._dispatcher.getListenerPriority(eventName, listener);
            this._dispatcher.removeListener(eventName, listener);
            this._dispatcher.addListener(eventName, listener.wrappedListener, priority);

            if (undefined !== this._logger) {
                const ctx = { event: eventName, listener: listener.pretty };

                if (listener.wasCalled) {
                    this._logger.debug('Notified event "{event}" to listener "{listener}"', ctx);

                    if (undefined === this._called[eventName]) {
                        this._called[eventName] = new Set();
                    }

                    this._called[eventName].add(listener);
                } else {
                    this._logger.debug('Listener "{listener}" was not called for event "{event}"', ctx);
                }

                if (listener.stoppedPropagation) {
                    this._logger.debug('Listener "{listener}" stopped propagation of event "{event}"', ctx);
                }
            }
        }
    }
}

module.exports = TraceableEventDispatcher;
