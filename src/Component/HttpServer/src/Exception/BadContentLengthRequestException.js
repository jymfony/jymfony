const BadRequestException = Jymfony.Component.HttpServer.Exception.BadRequestException;

/**
 * @memberOf Jymfony.Component.HttpServer.Exception
 */
class BadContentLengthRequestException extends BadRequestException {
    /**
     * Constructor.
     *
     * @param {string} [message = 'Content-Length mismatch']
     * @param {null|int} [code = null]
     * @param {Exception} [previous]
     */
    __construct(message = 'Content-Length mismatch', code = null, previous = undefined) {
        super.__construct(message, code, previous);
    }
}

module.exports = BadContentLengthRequestException;
