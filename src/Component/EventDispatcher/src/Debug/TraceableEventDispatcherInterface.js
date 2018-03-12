/**
 * @memberOf Jymfony.Component.EventDispatcher.Debug
 */
class TraceableEventDispatcherInterface {
    /**
     * Gets the called listeners.
     *
     * @returns {Iterable<string, Set<Function>>} An array of called listeners
     */
    get calledListeners() { }

    /**
     * Gets the not called listeners.
     *
     * @returns {Iterable<string, Set<Function>>} An array of not called listeners
     */
    get notCalledListeners() { }
}

module.exports = getInterface(TraceableEventDispatcherInterface);
