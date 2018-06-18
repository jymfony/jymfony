const HttpExceptionInterface = Jymfony.Component.HttpFoundation.Exception.HttpExceptionInterface;

/**
 * Represents an http exception, which generates a response
 * with the correct status code and headers.
 *
 * @memberOf Jymfony.Component.HttpFoundation.Exception
 */
class HttpException extends mix(RuntimeException, HttpExceptionInterface) {
    /**
     * Constructor.
     *
     * @param {int} statusCode
     * @param {string} message
     * @param {Exception} [previous]
     * @param {Object} [headers = {}]
     * @param {int} [code = 0]
     */
    __construct(statusCode, message, previous = undefined, headers = {}, code = 0) {
        super.__construct(message, code, previous);

        /**
         * @type {int}
         *
         * @private
         */
        this._statusCode = statusCode;

        /**
         * @type {Object}
         *
         * @private
         */
        this._headers = headers;
    }

    /**
     * @inheritdoc
     */
    get statusCode() {
        return this._statusCode;
    }

    /**
     * @inheritdoc
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
