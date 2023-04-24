/**
 * @memberOf Jymfony.Contracts.EventDispatcher
 */
class StoppableEventInterface {
    /**
     * Whether the propagation of the current is has been stopped.
     *
     * @returns {boolean}
     */
    isPropagationStopped() { }

    /**
     * Immediately stops the propagation of the event.
     */
    stopPropagation() { }
}

export default getInterface(StoppableEventInterface);
