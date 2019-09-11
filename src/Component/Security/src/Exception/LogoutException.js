/**
 * LogoutException is thrown when the account cannot be logged out.
 *
 * @memberOf Jymfony.Component.Security.Exception
 */
export default class LogoutException extends RuntimeException {
    /**
     * Constructor.
     *
     * @param {string} [message = "Logout exception."]
     * @param {Error} [previous]
     */
    __construct(message = 'Logout exception.', previous = undefined) {
        super.__construct(message, 403, previous);
    }
}
