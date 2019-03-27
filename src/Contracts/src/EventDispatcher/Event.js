/**
 * @memberOf Jymfony.Contracts.EventDispatcher
 */
class Event {
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

module.exports = Event;
