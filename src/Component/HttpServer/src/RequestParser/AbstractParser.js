const BadContentLengthRequestException = Jymfony.Component.HttpServer.Exception.BadContentLengthRequestException;
const ParserInterface = Jymfony.Component.HttpServer.RequestParser.ParserInterface;

/**
 * @memberOf Jymfony.Component.HttpServer.RequestParser
 * @internal
 * @abstract
 */
class AbstractParser extends implementationOf(ParserInterface) {
    /**
     * Constructor.
     *
     * @param {IncomingMessage} req
     * @param {int} contentLength
     */
    __construct(req, contentLength) {
        /**
         * @type {IncomingMessage}
         * @private
         */
        this._request = req;

        /**
         * @type {int}
         * @private
         */
        this._contentLength = contentLength;

        /**
         * @type {Buffer}
         * @private
         */
        this._buffer = Buffer.allocUnsafe(0);
    }

    /**
     * @inheritDoc
     */
    get buffer() {
        return this._buffer;
    }

    /**
     * @inheritDoc
     */
    parse() {
        return new Promise((resolve) => {
            this._request.on('data', /** {Buffer|string} */ chunk => {
                this._buffer = Buffer.concat([ this._buffer, chunk ]);
            });
            this._request.on('end', () => {
                if (undefined !== this._contentLength && this._contentLength !== this._buffer.length) {
                    throw new BadContentLengthRequestException();
                }

                resolve(this.decode(this._buffer.toString('ascii')));
            });
        });
    }
}

module.exports = AbstractParser;
