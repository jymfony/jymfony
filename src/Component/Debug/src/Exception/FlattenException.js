const HttpExceptionInterface = Jymfony.Component.HttpFoundation.Exception.HttpExceptionInterface;
const RequestExceptionInterface = Jymfony.Component.HttpFoundation.Exception.RequestExceptionInterface;
const Response = Jymfony.Component.HttpFoundation.Response;

const asyncReflection = new ReflectionClass(__jymfony.Async);

/**
 * Wraps an error to be able to serialize it.
 *
 * @memberOf Jymfony.Component.Debug.Exception
 */
export default class FlattenException {
    __construct() {
        this.message = undefined;
        this.code = undefined;
        this.statusCode = undefined;
        this.statusText = undefined;
        this.headers = undefined;
        this.trace = undefined;
        this.traceAsString = undefined;
        this.class = undefined;
        this.file = undefined;
        this.line = undefined;
        this.previous = undefined;

        /**
         * @type {null|string}
         *
         * @private
         */
        this._asString = null;
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

        if (
            ReflectionClass.exists('Jymfony.Component.HttpFoundation.Response') &&
            !! Jymfony.Component.HttpFoundation.Response.statusTexts[statusCode]
        ) {
            e.statusText = Jymfony.Component.HttpFoundation.Response.statusTexts[statusCode];
        } else {
            e.statusText = 'Whoops, looks like something went wrong.';
        }

        e.statusCode = statusCode;
        e.headers = headers;
        e.traceAsString = exception.stack;
        e.trace = exception instanceof Exception ?
            exception.stackTrace :
            (Exception.parseStackTrace(exception) || []);

        e.trace = e.trace.filter(t => {
            return t.file !== asyncReflection.filename;
        });

        let className = exception.constructor.name;
        try {
            className = (new ReflectionClass(exception)).name || className;
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

    toArray() {
        const exceptions = [];
        for (const exception of [ this, ...this.allPrevious ]) {
            exceptions.push({
                message: exception.message,
                'class': exception.class,
                trace: exception.trace,
            });
        }

        return exceptions;
    }

    /**
     * Gets all the previous exceptions.
     */
    get allPrevious() {
        const exceptions = [];
        let e = this;

        while ((e = e.previous)) {
            exceptions.push(e);
        }

        return exceptions;
    }

    /**
     * Sets the string representation of the exception.
     *
     * @param {null|string} asString
     */
    set asString(asString) {
        this._asString = asString || null;
    }

    /**
     * Gets the string representation of the exception.
     *
     * @returns {string}
     */
    get asString() {
        if (!! this._asString) {
            return this._asString;
        }

        let message = '';
        let next = false;

        for (const exception of [ this, ...this.allPrevious ].reverse()) {
            if (next) {
                message += 'Next ';
            } else {
                next = true;
            }

            message = exception.class;

            if ('' != exception.message) {
                message += ': ' + exception.message;
            }

            message += ' in ' + exception.file + ':' + exception.line +
                '\nStack trace:\n' + exception.traceAsString + '\n\n';
        }

        return __jymfony.rtrim(message);
    }
}
