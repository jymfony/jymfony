const StoppableEventInterface = Jymfony.Contracts.EventDispatcher.StoppableEventInterface;

/**
 * @memberOf Jymfony.Contracts.EventDispatcher
 */
export default class Event extends implementationOf(StoppableEventInterface) {
    /**
     * Constructor.
     */
    __construct() {
        /**
         * @type {boolean}
         *
         * @private
         */
        this._propagationStopped = false;
    }

    /**
     * @returns {boolean}
     */
    isPropagationStopped() {
        return this._propagationStopped;
    }

    stopPropagation() {
        this._propagationStopped = true;
    }
}
