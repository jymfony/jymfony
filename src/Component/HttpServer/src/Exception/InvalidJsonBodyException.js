const BadRequestException = Jymfony.Component.HttpServer.Exception.BadRequestException;

/**
 * @memberOf Jymfony.Component.HttpServer.Exception
 */
class InvalidJsonBodyException extends BadRequestException {
    __construct(invalidBody, message = 'Invalid JSON request body', code = null, previous = undefined) {
        this._invalidBody = invalidBody;

        super.__construct(message, code, previous);
    }

    get invalidBody() {
        return this._invalidBody;
    }
}

module.exports = InvalidJsonBodyException;
