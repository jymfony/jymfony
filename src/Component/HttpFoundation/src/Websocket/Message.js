/**
 * @memberOf Jymfony.Component.HttpFoundation.Websocket
 */
class Message {
    /**
     * Constructor.
     *
     * @param {Buffer|string} data
     * @param {string} type
     */
    __construct(data, type = undefined) {
        if (undefined === type) {
            type = isString(data) ? __self.TYPE_TEXT : __self.TYPE_BINARY;
        }

        /**
         * @type {Buffer}
         *
         * @private
         */
        this._buffer = Buffer.from(data);

        /**
         * @type {string}
         *
         * @private
         */
        this._type = type;
    }

    /**
     * The message type.
     *
     * @returns {string}
     */
    get type() {
        return this._type;
    }

    /**
     * Gets the message data as buffer.
     *
     * @returns {Buffer}
     */
    asBuffer() {
        return Buffer.from(this._buffer);
    }

    /**
     * Gets the message data as string.
     *
     * @param {string} encoding
     *
     * @returns {String}
     */
    asString(encoding = 'utf8') {
        return this._buffer.toString(encoding);
    }
}

Message.TYPE_TEXT = 'text';
Message.TYPE_BINARY = 'binary';
Message.TYPE_PING = 'ping';

module.exports = Message;
