const Event = Jymfony.Component.EventDispatcher.Event;
const InvalidArgumentException = Jymfony.Component.EventDispatcher.Exception.InvalidArgumentException;

/**
 * @memberOf Jymfony.Component.EventDispatcher
 */
class EventDispatcher {
    __construct() {
        /**
         * Listeners map.
         *
         * @type {Object.<string, [Object]>}
         * @private
         */
        this._listeners = {};

        /**
         * Listeners map sorted by priority.
         *
         * @type {Object.<string, [Object]>}
         * @private
         */
        this._sorted = {};
    }

    /**
     * Dispatches an event.
     * Returns a promise that resolves asynchronously running all
     * the listeners.
     *
     * @param {string} eventName
     * @param {Jymfony.Component.EventDispatcher.Event} event
     *
     * @returns {Promise.<Jymfony.Component.EventDispatcher.Event>}
     */
    dispatch(eventName, event = new Event) {
        let p = Promise.resolve(event);
        for(let listener of this.getListeners(eventName)) {
            p.then(event => {
                if (event.isPropagationStopped()) {
                    return event;
                }

                return __jymfony.Async.run(listener, event, eventName, this);
            });
        }

        return p;
    }

    /**
     * Gets the listeners associated to an event.
     *
     * @param {string} eventName
     *
     * @returns {Array}
     */
    * getListeners(eventName = undefined) {
        if (eventName) {
            if (! this._listeners[eventName]) {
                return [];
            }

            if (! this._sorted[eventName]) {
                this._sortListeners(eventName);
            }

            for (let listener of this._sorted[eventName]) {
                yield listener.listener;
            }
        } else {
            for (let eventName of Object.keys(this._listeners)) {
                yield * this.getListeners(eventName);
            }
        }
    }

    /**
     * Attach a listener to an event.
     *
     * @param {string} eventName
     * @param {Function|Array} listener
     * @param {int} priority
     */
    addListener(eventName, listener, priority = 0) {
        if (isCallableArray(listener)) {
            listener = getCallableFromArray(listener);
        }

        if (! isFunction(listener)) {
            throw new InvalidArgumentException("Listener must be a function");
        }

        let listeners = this._listeners[eventName];
        if (undefined === listeners) {
            listeners = this._listeners[eventName] = [];
        }

        listeners.push({ listener: listener, priority: priority });
        delete this._sorted[eventName];
    }

    /**
     * Whether an event has listeners attached.
     *
     * @param {string} eventName
     *
     * @returns {boolean} true if at least one listener is registered, false otherwise
     */
    hasListeners(eventName) {
        return (!! this._listeners[eventName]) && 0 < this._listeners[eventName].length;
    }

    /**
     * Detach a listener.
     *
     * @param {string} eventName
     * @param {Function|Array} listener
     */
    removeListener(eventName, listener) {
        if (! this._listeners[eventName]) {
            return;
        }

        if (isCallableArray(listener)) {
            listener = getCallableFromArray(listener);
        }

        for (let registered of this._listeners[eventName]) {
            if (! EventDispatcher._funcEquals(registered.listener, listener)) {
                continue;
            }

            let index = this._listeners[eventName].indexOf(registered);
            this._listeners[eventName].splice(index, 1);
        }
    }

    /**
     * Adds and event subscriber
     *
     * @param {*} subscriber
     */
    addSubscriber(subscriber) {
        let events = __jymfony.getFunction(subscriber, 'getSubscribedEvents')();
        for (let eventName of Object.keys(events)) {
            let params = events[eventName];
            if (isString(params)) {
                this.addListener(eventName, [ subscriber, params ]);
            } else if (isString(params[0])) {
                this.addListener(eventName, [ subscriber, params[0] ], params[1] || 0);
            } else {
                for (let listener of params) {
                    this.addListener(eventName, [ subscriber, listener[0] ], listener[1] || 0);
                }
            }
        }
    }

    /**
     * Detaches all the listeners from a subscriber
     *
     * @param {*} subscriber
     */
    removeSubscriber(subscriber) {
        let events = __jymfony.getFunction(subscriber, 'getSubscribedEvents')();
        for (let eventName of Object.keys(events)) {
            let params = events[eventName];
            if (isArray(params) && isArray(params[0])) {
                for(let listener of params) {
                    this.removeListener(eventName, [ subscriber, listener[0] ]);
                }
            } else {
                this.removeListener(eventName, [ subscriber, isString(params) ? params : params[0] ]);
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
        let listeners = [ ...this._listeners[eventName] ];
        this._sorted[eventName] = listeners.sort((a, b) => {
            return b.priority - a.priority;
        });
    }

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

module.exports = EventDispatcher;
