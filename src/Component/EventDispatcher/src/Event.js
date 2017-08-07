/**
 * @memberOf Jymfony.Component.EventDispatcher
 */
class Event {
    __construct() {
        this._propagationStopped = false;
    }

    isPropagationStopped() {
        return this._propagationStopped;
    }

    stopPropagation() {
        this._propagationStopped = true;
    }
}

module.exports = Event;
