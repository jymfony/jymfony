const HttpException = Jymfony.Component.HttpFoundation.Exception.HttpException;
const Response = Jymfony.Component.HttpFoundation.Response;

/**
 * Returns status code 403.
 *
 * @memberOf Jymfony.Component.HttpFoundation.Exception
 */
class AccessDeniedHttpException extends HttpException {
    /**
     * Constructor.
     *
     * @param {string} message
     * @param {Exception} [previous]
     * @param {Object} [headers = {}]
     * @param {int} [code = 0]
     */
    __construct(message, previous = undefined, headers = {}, code = 0) {
        super.__construct(Response.HTTP_FORBIDDEN, message, previous, headers, code);
    }
}

module.exports = AccessDeniedHttpException;
