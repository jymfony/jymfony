const EventDispatcherInterface = Jymfony.Contracts.EventDispatcher.EventDispatcherInterface;
const InvalidArgumentException = Jymfony.Component.EventDispatcher.Exception.InvalidArgumentException;
const StoppableEventInterface = Jymfony.Contracts.EventDispatcher.StoppableEventInterface;

/**
 * @memberOf Jymfony.Component.EventDispatcher
 */
export default class EventDispatcher extends implementationOf(EventDispatcherInterface) {
    /**
     * Constructor.
     */
    __construct() {
        /**
         * Listeners map.
         *
         * @type {Object.<string, Object[]>}
         *
         * @private
         */
        this._listeners = {};

        /**
         * Listeners map sorted by priority.
         *
         * @type {Object.<string, Object[]>}
         *
         * @private
         */
        this._sorted = {};
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

        for (const listener of this.getListeners(eventName)) {
            if (event instanceof StoppableEventInterface && event.isPropagationStopped()) {
                return event;
            }

            await listener(event, eventName, this);
        }

        return event;
    }

    /**
     * @inheritdoc
     */
    * getListeners(eventName = undefined) {
        if (eventName) {
            if (ReflectionClass.exists(eventName)) {
                eventName = ReflectionClass.getClassName(eventName);
            }

            if (! this._listeners[eventName]) {
                return [];
            }

            if (! this._sorted[eventName]) {
                this._sortListeners(eventName);
            }

            for (const listener of this._sorted[eventName]) {
                yield listener.listener;
            }
        } else {
            for (const eventName of Object.keys(this._listeners)) {
                yield [ eventName, [ ...this.getListeners(eventName) ] ];
            }
        }
    }

    /**
     * @inheritdoc
     */
    addListener(eventName, listener, priority = 0) {
        if (ReflectionClass.exists(eventName)) {
            eventName = ReflectionClass.getClassName(eventName);
        }

        let listeners = this._listeners[eventName];
        if (undefined === listeners) {
            listeners = this._listeners[eventName] = [];
        }

        listeners.push({ listener: listener, priority: priority });
        delete this._sorted[eventName];
    }

    /**
     * @inheritdoc
     */
    hasListeners(eventName) {
        if (ReflectionClass.exists(eventName)) {
            eventName = ReflectionClass.getClassName(eventName);
        }

        return (!! this._listeners[eventName]) && 0 < this._listeners[eventName].length;
    }

    /**
     * @inheritdoc
     */
    removeListener(eventName, listener) {
        if (ReflectionClass.exists(eventName)) {
            eventName = ReflectionClass.getClassName(eventName);
        }

        if (! this._listeners[eventName]) {
            return;
        }

        if (isArray(listener) && undefined !== listener[0] && isFunction(listener[0])) {
            listener[0] = listener[0]();
        }

        if (isCallableArray(listener)) {
            listener = getCallableFromArray(listener);
        }

        for (const registered of this._listeners[eventName]) {
            if (isArray(registered.listener) && undefined !== registered.listener[0] && isFunction(registered.listener[0])) {
                registered.listener[0] = registered.listener[0]();
            }

            if (isCallableArray(registered.listener)) {
                registered.listener = getCallableFromArray(registered.listener);
            }

            if (! EventDispatcher._funcEquals(registered.listener, listener)) {
                continue;
            }

            const index = this._listeners[eventName].indexOf(registered);
            this._listeners[eventName].splice(index, 1);
        }

        delete this._sorted[eventName];
    }

    /**
     * @inheritdoc
     */
    addSubscriber(subscriber) {
        const events = __jymfony.getFunction(subscriber, 'getSubscribedEvents')();
        for (let eventName of Object.keys(events)) {
            if (ReflectionClass.exists(eventName)) {
                eventName = ReflectionClass.getClassName(eventName);
            }

            const params = events[eventName];
            if (isString(params)) {
                this.addListener(eventName, [ subscriber, params ]);
            } else if (isString(params[0])) {
                this.addListener(eventName, [ subscriber, params[0] ], params[1] || 0);
            } else {
                for (const listener of params) {
                    this.addListener(eventName, [ subscriber, listener[0] ], listener[1] || 0);
                }
            }
        }
    }

    /**
     * @inheritdoc
     */
    removeSubscriber(subscriber) {
        const events = __jymfony.getFunction(subscriber, 'getSubscribedEvents')();
        for (let eventName of Object.keys(events)) {
            if (ReflectionClass.exists(eventName)) {
                eventName = ReflectionClass.getClassName(eventName);
            }

            const params = events[eventName];
            if (isArray(params) && isArray(params[0])) {
                for(const listener of params) {
                    this.removeListener(eventName, [ subscriber, listener[0] ]);
                }
            } else {
                this.removeListener(eventName, [ subscriber, isString(params) ? params : params[0] ]);
            }
        }
    }

    /**
     * @inheritdoc
     */
    getListenerPriority(eventName, listener) {
        if (ReflectionClass.exists(eventName)) {
            eventName = ReflectionClass.getClassName(eventName);
        }

        if (! this._listeners[eventName]) {
            return;
        }

        if (isArray(listener) && undefined !== listener[0] && isFunction(listener[0])) {
            listener[0] = listener[0]();
        }

        if (isCallableArray(listener)) {
            listener = getCallableFromArray(listener);
        }

        for (const v of this._listeners[eventName]) {
            if (isArray(v.listener) && undefined !== v.listener[0] && isFunction(v.listener[0])) {
                v.listener[0] = v.listener[0]();
            }

            if (isCallableArray(v.listener)) {
                v.listener = getCallableFromArray(v.listener);
            }

            if (v.listener === listener || __self._funcEquals(listener, v.listener)) {
                return v.priority;
            }
        }
    }

    /**
     * Sorts the array of listeners based on priority.
     *
     * @param {string} eventName
     *
     * @private
     */
    _sortListeners(eventName) {
        if (undefined === this._listeners[eventName]) {
            return;
        }

        // Clone the array
        const listeners = [ ...this._listeners[eventName] ];
        this._sorted[eventName] = [];
        for (const listener of listeners.sort((a, b) => b.priority - a.priority)) {
            if (isArray(listener.listener) && undefined !== listener.listener[0] && isFunction(listener.listener[0])) {
                listener.listener[0] = listener.listener[0]();
            }

            if (isCallableArray(listener.listener)) {
                listener.listener = getCallableFromArray(listener.listener);
            }

            if (! isFunction(listener.listener)) {
                throw new InvalidArgumentException('Listener must be a function');
            }

            this._sorted[eventName].push(listener);
        }
    }

    /**
     * @param {Function} func1
     * @param {Function} func2
     * @returns {boolean}
     *
     * @private
     */
    static _funcEquals(func1, func2) {
        if (func1.innerObject) {
            func1 = func1.innerObject;
        }

        if (func2.innerObject) {
            func2 = func2.innerObject;
        }

        if (func1.constructor.name !== func2.constructor.name) {
            return false;
        }

        if (func1 instanceof BoundFunction) {
            return func1.equals(func2);
        }

        return func1 === func2;
    }
}
