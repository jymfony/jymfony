const BadContentLengthRequestException = Jymfony.Component.HttpServer.Exception.BadContentLengthRequestException;
const ParserInterface = Jymfony.Component.HttpServer.RequestParser.ParserInterface;

/**
 * @memberOf Jymfony.Component.HttpServer.RequestParser
 *
 * @internal
 *
 * @abstract
 */
export default class AbstractParser extends implementationOf(ParserInterface) {
    /**
     * Constructor.
     *
     * @param {stream.Duplex} stream
     * @param {int} contentLength
     */
    __construct(stream, contentLength) {
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
     * Decodes a string buffer into a request param object.
     *
     * @param {string} buffer
     *
     * @returns {Object.<string, *>, Object.<string, Jymfony.Component.HttpFoundation.File.UploadedFile>[]}
     *
     * @abstract
     */
    decode() {
        throw new LogicException('Method "decode" must be implemented.');
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
                    reject(new BadContentLengthRequestException());
                    return;
                }

                resolve(this.decode(this._buffer.toString('ascii')));
            });
        });
    }
}
