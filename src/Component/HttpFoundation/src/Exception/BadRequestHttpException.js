const HttpException = Jymfony.Component.HttpFoundation.Exception.HttpException;
const Response = Jymfony.Component.HttpFoundation.Response;

/**
 * Represents a bad request exception.
 * Returns status code 400.
 *
 * @memberOf Jymfony.Component.HttpFoundation.Exception
 */
export default class BadRequestHttpException extends HttpException {
    /**
     * Constructor.
     *
     * @param {string} message
     * @param {Exception} [previous]
     * @param {Object} [headers = {}]
     * @param {int} [code = 0]
     */
    __construct(message, previous = undefined, headers = {}, code = 0) {
        super.__construct(Response.HTTP_BAD_REQUEST, message, previous, headers, code);
    }
}
