const ClsTrait = Jymfony.Contracts.Async.ClsTrait;
const EventDispatcherInterface = Jymfony.Contracts.EventDispatcher.EventDispatcherInterface;
const NullLogger = Jymfony.Contracts.Logger.NullLogger;
const StoppableEventInterface = Jymfony.Contracts.EventDispatcher.StoppableEventInterface;
const WrappedListener = Jymfony.Component.EventDispatcher.Debug.WrappedListener;

const collator = new Intl.Collator('en');
const EmptyObject = {};

/**
 * @memberOf Jymfony.Component.EventDispatcher.Debug
 */
export default class TraceableEventDispatcher extends implementationOf(EventDispatcherInterface, ClsTrait) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Contracts.EventDispatcher.EventDispatcherInterface} dispatcher
     * @param {Jymfony.Contracts.Stopwatch.StopwatchInterface} stopwatch
     * @param {undefined|Jymfony.Contracts.Logger.LoggerInterface} [logger]
     */
    __construct(dispatcher, stopwatch, logger = undefined) {
        /**
         * @type {Jymfony.Contracts.EventDispatcher.EventDispatcherInterface}
         *
         * @private
         */
        this._dispatcher = dispatcher;

        /**
         * @type {Jymfony.Contracts.Stopwatch.StopwatchInterface}
         *
         * @protected
         */
        this._stopwatch = stopwatch;

        /**
         * @type {undefined|Jymfony.Contracts.Logger.LoggerInterface}
         *
         * @private
         */
        this._logger = logger || new NullLogger();

        /**
         * @type {Object.<string, Set<Function>>}
         *
         * @private
         */
        this._called = {};

        /**
         * @type {WeakMap<Jymfony.Component.HttpFoundation.Request, [ string, Jymfony.Component.EventDispatcher.Debug.WrappedListener ][]>}
         *
         * @private
         */
        this._callStack = new WeakMap();

        /**
         * @type {Object.<string, Jymfony.Component.EventDispatcher.Debug.WrappedListener[]>}
         *
         * @private
         */
        this._wrappedListeners = {};

        /**
         * @type {WeakMap<Jymfony.Component.HttpFoundation.Request, any>}
         *
         * @private
         */
        this._orphanedEvents = new WeakMap();
    }

    /**
     * @inheritDoc
     */
    addListener(eventName, listener, priority = 0) {
        this._dispatcher.addListener(eventName, listener, priority);
    }

    /**
     * @inheritDoc
     */
    addSubscriber(subscriber) {
        this._dispatcher.addSubscriber(subscriber);
    }

    /**
     * @inheritDoc
     */
    removeListener(eventName, listener) {
        if (undefined !== this._wrappedListeners[eventName]) {
            for (const [ index, wrappedListener ] of __jymfony.getEntries(this._wrappedListeners[eventName])) {
                if (wrappedListener.wrappedListener === listener) {
                    listener = wrappedListener;
                    this._wrappedListeners[eventName].splice(index, 1);
                    break;
                }
            }
        }

        return this._dispatcher.removeListener(eventName, listener);
    }

    /**
     * @inheritDoc
     */
    removeSubscriber(subscriber) {
        return this._dispatcher.removeSubscriber(subscriber);
    }

    /**
     * @inheritDoc
     */
    getListeners(eventName = undefined) {
        return this._dispatcher.getListeners(eventName);
    }

    /**
     * @inheritDoc
     */
    getListenerPriority(eventName, listener) {
        // We might have wrapped listeners for the event (if called while dispatching)
        // In that case get the priority by wrapper
        if (undefined !== this._wrappedListeners[eventName]) {
            for (const [ , wrappedListener ] of __jymfony.getEntries(this._wrappedListeners[eventName])) {
                if (wrappedListener.wrappedListener === listener) {
                    return this._dispatcher.getListenerPriority(eventName, wrappedListener);
                }
            }
        }

        return this._dispatcher.getListenerPriority(eventName, listener);
    }

    /**
     * @inheritDoc
     */
    hasListeners(eventName) {
        return this._dispatcher.hasListeners(eventName);
    }

    /**
     * @inheritdoc
     */
    async dispatch(event, eventName = undefined) {
        if (undefined === eventName) {
            eventName = ReflectionClass.getClassName(event);
        }

        if (ReflectionClass.exists(eventName)) {
            eventName = ReflectionClass.getClassName(eventName);
        }

        if (event instanceof StoppableEventInterface && event.isPropagationStopped()) {
            this._logger.debug('The "' + eventName + '" event is already stopped. No listeners have been called.');
        }

        this._preProcess(eventName);
        try {
            this._preDispatch(eventName, event);
            try {
                const e = this._stopwatch.start(eventName, 'section');
                try {
                    await this._dispatcher.dispatch(event, eventName);
                } finally {
                    if (e.isStarted()) {
                        e.stop();
                    }
                }
            } finally {
                this._postDispatch(eventName, event);
            }
        } finally {
            this._postProcess(eventName);
        }

        return event;
    }

    /**
     * @param {Jymfony.Component.HttpFoundation.Request | null} request
     *
     * @returns {Object.<string, *>[]}
     */
    getCalledListeners(request) {
        request = request || EmptyObject;
        const called = [];
        for (const [ eventName, listener ] of this._callStack.get(request) || []) {
            called.push(listener.getInfo(eventName));
        }

        return called;
    }

    /**
     * @param {Jymfony.Component.HttpFoundation.Request | null} request
     *
     * @returns {Object.<string, *>[]}
     */
    getNotCalledListeners(request) {
        request = request || EmptyObject;

        let allListeners;
        try {
            allListeners = [ ...this.getListeners() ];
        } catch (e) {
            this._logger.info('An exception was thrown while getting the uncalled listeners.', { exception: e });

            // Unable to retrieve the uncalled listeners
            return [];
        }

        const calledListeners = [];
        for (const [ , calledListener ] of this._callStack.get(request) || []) {
            calledListeners.push(calledListener.wrappedListener);
        }

        const notCalled = [];
        for (const [ eventName, listeners ] of allListeners) {
            for (let listener of listeners) {
                if (!calledListeners.includes(listener)) {
                    if (! (listener instanceof WrappedListener)) {
                        listener = new WrappedListener(listener, null, this._stopwatch, this);
                    }

                    notCalled.push(listener.getInfo(eventName));
                }
            }
        }

        notCalled.sort(__self._sortNotCalledListeners);

        return notCalled;
    }

    /**
     * @param {Jymfony.Component.HttpFoundation.Request | null} request
     */
    getOrphanedEvents(request) {
        return this._orphanedEvents.get(request || EmptyObject) || [];
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
        const currentRequest = this._activeContext[ClsTrait.REQUEST_SYMBOL] || EmptyObject;
        if (! this._dispatcher.hasListeners(eventName)) {
            if (! this._orphanedEvents.has(currentRequest)) {
                this._orphanedEvents.set(currentRequest, []);
            }

            this._orphanedEvents.get(currentRequest).push(eventName);
        } else {
            for (const listener of this._dispatcher.getListeners(eventName)) {
                const priority = this.getListenerPriority(eventName, listener);

                const wrappedListener = new WrappedListener(listener instanceof WrappedListener ? listener.wrappedListener : listener, null, this._stopwatch, this);
                this._wrappedListeners[eventName] = this._wrappedListeners[eventName] || [];
                this._wrappedListeners[eventName].push(wrappedListener);

                this._dispatcher.removeListener(eventName, listener);
                this._dispatcher.addListener(eventName, wrappedListener, priority);

                const listeners = this._callStack.get(currentRequest) || [];
                listeners.push([ eventName, wrappedListener ]);
                this._callStack.set(currentRequest, listeners);
            }
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
        const currentRequest = this._activeContext[ClsTrait.REQUEST_SYMBOL] || EmptyObject;
        delete this._wrappedListeners[eventName];

        let skipped = false;
        for (const listener of this._dispatcher.getListeners(eventName)) {
            if (! (listener instanceof WrappedListener)) { // A new listener was added during dispatch.
                continue;
            }

            // Unwrap listener
            const priority = this.getListenerPriority(eventName, listener);
            this._dispatcher.removeListener(eventName, listener);
            this._dispatcher.addListener(eventName, listener.wrappedListener, priority);

            const context = { event: eventName, listener: listener.pretty };

            if (listener.wasCalled) {
                this._logger.debug('Notified event "{event}" to listener "{listener}".', context);
            } else {
                const listeners = this._callStack.get(currentRequest);
                this._callStack.set(currentRequest, listeners.filter(([ , wl ]) => wl !== listener));
            }

            if (skipped) {
                this._logger.debug('Listener "{listener}" was not called for event "{event}".', context);
            }

            if (listener.stoppedPropagation) {
                this._logger.debug('Listener "{listener}" stopped propagation of the event "{event}".', context);
                skipped = true;
            }
        }
    }

    static _sortNotCalledListeners(a, b) {
        const cmp = collator.compare(a.event, b.event);
        if (0 !== cmp) {
            return cmp;
        }

        if (isNumber(a.priority) && !isNumber(b.priority)) {
            return 1;
        }

        if (!isNumber(a.priority) && isNumber(b.priority)) {
            return -1;
        }

        if (a.priority === b.priority) {
            return 0;
        }

        if (a.priority > b.priority) {
            return -1;
        }

        return 1;
    }
}
