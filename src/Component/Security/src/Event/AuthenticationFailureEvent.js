const AuthenticationEvent = Jymfony.Component.Security.Event.AuthenticationEvent;

/**
 * Dispatched on authentication failure.
 *
 * @memberOf Jymfony.Component.Security.Event
 */
export default class AuthenticationFailureEvent extends AuthenticationEvent {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Security.Authentication.Token.TokenInterface} token
     * @param {Jymfony.Component.Security.Exception.AuthenticationException} exception
     */
    __construct(token, exception) {
        super.__construct(token);

        /**
         * @type {Jymfony.Component.Security.Exception.AuthenticationException}
         *
         * @private
         */
        this._exception = exception;
    }

    /**
     * Gets the authentication exception originating this event.
     *
     * @returns {Jymfony.Component.Security.Exception.AuthenticationException}
     */
    get authenticationException() {
        return this._exception;
    }
}
