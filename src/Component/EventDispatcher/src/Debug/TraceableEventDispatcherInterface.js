/**
 * @memberOf Jymfony.Component.EventDispatcher.Debug
 */
class TraceableEventDispatcherInterface {
    /**
     * Gets the called listeners.
     *
     * @returns {IterableIterator<[string, Set<Invokable<any>>]>} An array of called listeners
     */
    get calledListeners() { }

    /**
     * Gets the not called listeners.
     *
     * @returns {IterableIterator<[string, Set<Invokable<any>>]>} An array of not called listeners
     */
    get notCalledListeners() { }
}

export default getInterface(TraceableEventDispatcherInterface);
