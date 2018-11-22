const BadContentLengthRequestException = Jymfony.Component.HttpServer.Exception.BadContentLengthRequestException;
const InvalidJsonBodyException = Jymfony.Component.HttpServer.Exception.InvalidJsonBodyException;
const ParserInterface = Jymfony.Component.HttpServer.RequestParser.ParserInterface;

/**
 * @memberOf Jymfony.Component.HttpServer.RequestParser
 *
 * @internal
 *
 * @final
 */
class JsonEncodedParser extends implementationOf(ParserInterface) {
    /**
     * Constructor.
     *
     * @param {stream.Duplex} stream
     * @param {int} contentLength
     * @param {string} charset
     */
    __construct(stream, contentLength, charset) {
        /**
         * @type {stream.Duplex}
         *
         * @private
         */
        this._request = stream;

        /**
         * @type {int}
         *
         * @private
         */
        this._contentLength = contentLength;

        /**
         * @type {string}
         *
         * @private
         */
        this._charset = charset;

        /**
         * @type {Buffer}
         *
         * @private
         */
        this._buffer = Buffer.allocUnsafe(0);
    }

    /**
     * @inheritdoc
     */
    get buffer() {
        return this._buffer;
    }

    /**
     * @inheritdoc
     */
    parse() {
        return new Promise((resolve, reject) => {
            this._request.on('data', /** {Buffer|string} */ chunk => {
                this._buffer = Buffer.concat([ this._buffer, chunk ]);
            });
            this._request.on('end', () => {
                if (undefined !== this._contentLength && this._contentLength !== this._buffer.length) {
                    throw new BadContentLengthRequestException();
                }

                const body = this._buffer.toString(this._charset);
                try {
                    resolve(JSON.parse(body));
                } catch (e) {
                    reject(new InvalidJsonBodyException(body));
                }
            });
        });
    }
}

module.exports = JsonEncodedParser;
