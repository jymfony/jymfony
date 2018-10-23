const Event = Jymfony.Component.EventDispatcher.Event;

/**
 * General purpose authentication event
 *
 * @memberOf Jymfony.Component.Security.Event
 */
class AuthenticationEvent extends Event {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Security.Authentication.Token.TokenInterface} token
     */
    __construct(token) {
        /**
         * @type {Jymfony.Component.Security.Authentication.Token.TokenInterface}
         *
         * @private
         */
        this._token = token;
    }

    /**
     * Gets the subject of this event.
     *
     * @returns {Jymfony.Component.Security.Authentication.Token.TokenInterface}
     */
    get authenticationToken() {
        return this._token;
    }
}

module.exports = AuthenticationEvent;
