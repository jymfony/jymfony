/**
 * Represents an exception thrown on authorization (ie: the user has not the required roles).
 *
 * @memberOf Jymfony.Component.Security.Exception
 */
export default class AccessDeniedException extends RuntimeException {
    /**
     * Constructor.
     *
     * @param {string} [message = "Access denied."]
     * @param {Error} [previous]
     */
    __construct(message = 'Access denied.', previous = undefined) {
        super.__construct(message, 403, previous);

        this.attributes = [];
        this.subject = undefined;
    }
}
