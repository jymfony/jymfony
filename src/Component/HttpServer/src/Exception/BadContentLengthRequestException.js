const BadRequestException = Jymfony.Component.HttpServer.Exception.BadRequestException;

/**
 * @memberOf Jymfony.Component.HttpServer.Exception
 */
class BadContentLengthRequestException extends BadRequestException {
    constructor(message = 'Content-Length mismatch', code = null, previous = undefined) {
        super(message, code, previous);
    }
}

module.exports = BadContentLengthRequestException;
