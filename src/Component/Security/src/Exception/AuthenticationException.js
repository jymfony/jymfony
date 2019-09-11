/**
 * Represents an exception thrown on authentication processing.
 *
 * @memberOf Jymfony.Component.Security.Exception
 */
export default class AuthenticationException extends RuntimeException {
    /**
     * Gets the authentication token for the current exception.
     *
     * @return {undefined|Jymfony.Component.Security.Authentication.Token.TokenInterface}
     */
    get token() {
        return this._token;
    }

    /**
     * Sets the token that generated the exception.
     *
     * @param {Jymfony.Component.Security.Authentication.Token.TokenInterface} token
     */
    set token(token) {
        /**
         * @type {Jymfony.Component.Security.Authentication.Token.TokenInterface}
         *
         * @private
         */
        this._token = token;
    }

    /**
     * Gets the name of properties to be serialized.
     *
     * @return {string[]}
     */
    __sleep() {
        return [
            '_token',
            'name',
            'code',
            '_message',
            '_originalStack',
        ];
    }

    /**
     * Wakeup from de-serialization.
     */
    __wakeup() {
        this._updateStack();
    }

    /**
     * Message key to be used by the translation component.
     *
     * @returns {string}
     */
    get messageKey() {
        return 'An authentication exception occurred.';
    }

    /**
     * Message data to be used by the translation component.
     *
     * @returns {Object}
     */
    get messageData() {
        return {};
    }
}
