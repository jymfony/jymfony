const HttpExceptionInterface = Jymfony.Component.HttpFoundation.Exception.HttpExceptionInterface;
const RequestExceptionInterface = Jymfony.Component.HttpFoundation.Exception.RequestExceptionInterface;
const Response = Jymfony.Component.HttpFoundation.Response;

const asyncReflection = new ReflectionClass(__jymfony.Async);

/**
 * Wraps an error to be able to serialize it.
 *
 * @memberOf Jymfony.Component.Debug.Exception
 */
class FlattenException {
    __construct() {
        this.message = undefined;
        this.code = undefined;
        this.statusCode = undefined;
        this.headers = undefined;
        this.trace = undefined;
        this.class = undefined;
        this.file = undefined;
        this.line = undefined;
        this.previous = undefined;
    }

    /**
     * Creates a new FlattenException object
     *
     * @param {Error|Exception} exception
     * @param {int} [statusCode]
     * @param {Object.<string, string>} [headers = {}]
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
            (Exception.parseStackTrace(exception) || []);

        e.trace = e.trace.filter(t => {
            return t.file !== asyncReflection.filename;
        });

        let className = exception.constructor.name;
        try {
            className = (new ReflectionClass(exception)).name;
        } catch (ex) { }

        e.class = className;

        if (0 < e.trace.length) {
            e.file = e.trace[0].file;
            e.line = e.trace[0].line;
        }

        if (exception.previous) {
            e.previous = __self.create(exception.previous);
        }

        return e;
    }
}

module.exports = FlattenException;
