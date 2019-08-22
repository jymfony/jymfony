/**
 * @memberOf Jymfony.Contracts.EventDispatcher
 */
export default class Event {
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
