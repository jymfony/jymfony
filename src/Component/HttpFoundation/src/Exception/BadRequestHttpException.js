const HttpException = Jymfony.Component.HttpFoundation.Exception.HttpException;
const Response = Jymfony.Component.HttpFoundation.Response;

/**
 * Represents a bad request exception.
 * Returns status code 400.
 *
 * @memberOf Jymfony.Component.HttpFoundation.Exception
 */
class BadRequestHttpException extends HttpException {
    constructor(message, previous = undefined, headers = {}, code = 0) {
        super(Response.HTTP_BAD_REQUEST, message, previous, headers, code);
    }
}

module.exports = BadRequestHttpException;
