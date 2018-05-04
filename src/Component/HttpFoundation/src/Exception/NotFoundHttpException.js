const HttpException = Jymfony.Component.HttpFoundation.Exception.HttpException;
const Response = Jymfony.Component.HttpFoundation.Response;

/**
 * Represents a not found exception.
 * Returns status code 404.
 *
 * @memberOf Jymfony.Component.HttpFoundation.Exception
 */
class NotFoundHttpException extends HttpException {
    /**
     * Constructor.
     *
     * @param {string} message
     * @param {Exception} [previous]
     * @param {Object} [headers = {}]
     * @param {int} [code = 0]
     *
     * @inheritdoc
     */
    __construct(message, previous = undefined, headers = {}, code = 0) {
        super.__construct(Response.HTTP_NOT_FOUND, message, previous, headers, code);
    }
}

module.exports = NotFoundHttpException;
