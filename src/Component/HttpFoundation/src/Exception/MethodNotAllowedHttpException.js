const HttpException = Jymfony.Component.HttpFoundation.Exception.HttpException;
const Response = Jymfony.Component.HttpFoundation.Response;

/**
 * Returns status code 405.
 *
 * @memberOf Jymfony.Component.HttpFoundation.Exception
 */
class MethodNotAllowedHttpException extends HttpException {
    __construct(allow, message, previous = undefined, headers = {}, code = 0) {
        headers['Allow'] = allow.join(', ').toUpperCase();

        super.__construct(Response.HTTP_METHOD_NOT_ALLOWED, message, previous, headers, code);
    }
}

module.exports = MethodNotAllowedHttpException;
