const HttpExceptionInterface = Jymfony.Component.HttpFoundation.Exception.HttpExceptionInterface;

/**
 * Represents an http exception, which generates a response
 * with the correct status code and headers.
 *
 * @memberOf Jymfony.Component.HttpFoundation.Exception
 */
class HttpException extends mix(RuntimeException, HttpExceptionInterface) {
    constructor(statusCode, message, previous = undefined, headers = {}, code = 0) {
        super(message, code, previous);

        this._statusCode = statusCode;
        this._headers = headers;
    }

    /**
     * @inheritDoc
     */
    get statusCode() {
        return this._statusCode;
    }

    /**
     * @inheritDoc
     */
    get headers() {
        return Object.assign({}, this._headers);
    }

    /**
     * Sets response headers.
     *
     * @param headers
     */
    set headers(headers) {
        this._headers = Object.assign({}, headers);
    }
}

module.exports = HttpException;
