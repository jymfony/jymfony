const Event = Jymfony.Contracts.EventDispatcher.Event;

/**
 * @memberOf Jymfony.Contracts.EventDispatcher
 */
class EventDispatcherInterface {
    /**
     * Dispatches an event.
     * Returns a promise that resolves asynchronously running all
     * the listeners.
     *
     * @param {string} eventName
     * @param {Jymfony.Contracts.EventDispatcher.Event} [event = new Jymfony.Contracts.EventDispatcher.Event()]
     *
     * @returns {Promise<Jymfony.Contracts.EventDispatcher.Event>}
     */
    async dispatch(eventName, event = new Event()) { }

    /**
     * Attach a listener to an event.
     *
     * @param {string} eventName
     * @param {Function|Array} listener
     * @param {int} [priority = 0]
     */
    addListener(eventName, listener, priority = 0) { }

    /**
     * Adds and event subscriber
     *
     * @param {Jymfony.Contracts.EventDispatcher.EventSubscriberInterface} subscriber
     */
    addSubscriber(subscriber) { }

    /**
     * Detach a listener.
     *
     * @param {string} eventName
     * @param {Function|Array} listener
     */
    removeListener(eventName, listener) { }

    /**
     * Detaches all the listeners from a subscriber
     *
     * @param {Jymfony.Contracts.EventDispatcher.EventSubscriberInterface} subscriber
     */
    removeSubscriber(subscriber) { }

    /**
     * Gets the listeners associated to an event.
     *
     * @param {string} [eventName]
     *
     * @returns {Array}
     */
    * getListeners(eventName = undefined) { }

    /**
     * Gets the listener priority for a specific event.
     *
     * Returns undefined if the event or the listener does not exist.
     *
     * @param {string} eventName
     * @param {Function|Array} listener
     *
     * @returns {undefined|int}
     */
    getListenerPriority(eventName, listener) { }

    /**
     * Whether an event has listeners attached.
     *
     * @param {string} eventName
     *
     * @returns {boolean} true if at least one listener is registered, false otherwise
     */
    hasListeners(eventName) { }
}

export default getInterface(EventDispatcherInterface);
