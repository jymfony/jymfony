const HttpExceptionInterface = Jymfony.Component.HttpFoundation.Exception.HttpExceptionInterface;
const RequestExceptionInterface = Jymfony.Component.HttpFoundation.Exception.RequestExceptionInterface;
const Response = Jymfony.Component.HttpFoundation.Response;

/**
 * Wraps an error to be able to serialize it.
 *
 * @memberOf Jymfony.Component.Debug.Exception
 */
class FlattenException {
    /**
     * Creates a new FlattenException object
     *
     * @param {Error|Exception} exception
     * @param {int} statusCode
     * @param {Object<string, string>} headers
     */
    static create(exception, statusCode = undefined, headers = {}) {
        const e = new __self();
        e.message = exception.message;
        e.code = exception.code;

        if (undefined === statusCode) {
            statusCode = Response.HTTP_INTERNAL_SERVER_ERROR;
        }

        if (exception instanceof HttpExceptionInterface) {
            statusCode = exception.statusCode;
            headers = Object.assign({}, headers, exception.headers);
        } else if (exception instanceof RequestExceptionInterface) {
            statusCode = Response.HTTP_BAD_REQUEST;
        }

        e.statusCode = statusCode;
        e.headers = headers;
        e.trace = exception instanceof Exception ?
            exception.stackTrace :
            Exception.parseStackTrace(exception);

        let className = exception.constructor.name;
        try {
            className = (new ReflectionClass(exception)).name;
        } catch (ex) { }

        e.class = className;
        e.file = e.trace[0].file;
        e.line = e.trace[0].line;

        if (exception.previous) {
            e.previous = __self.create(exception.previous);
        }

        return e;
    }
}

module.exports = FlattenException;
