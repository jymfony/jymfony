const BadRequestException = Jymfony.Component.HttpServer.Exception.BadRequestException;

/**
 * @memberOf Jymfony.Component.HttpServer.Exception
 */
export default class InvalidJsonBodyException extends BadRequestException {
    /**
     * Constructor.
     *
     * @param {string} invalidBody
     * @param {string} [message = 'Invalid JSON request body']
     * @param {null|int} [code = null]
     * @param {Exception} [previous]
     */
    __construct(invalidBody, message = 'Invalid JSON request body', code = null, previous = undefined) {
        /**
         * @type {string}
         *
         * @private
         */
        this._invalidBody = invalidBody;

        super.__construct(message, code, previous);
    }

    /**
     * @returns {string}
     */
    get invalidBody() {
        return this._invalidBody;
    }
}
