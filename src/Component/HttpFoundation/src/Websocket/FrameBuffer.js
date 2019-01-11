const BadFrameException = Jymfony.Component.HttpFoundation.Websocket.Exception.BadFrameException;
const CloseFrameException = Jymfony.Component.HttpFoundation.Websocket.Exception.CloseFrameException;
const Frame = Jymfony.Component.HttpFoundation.Websocket.Frame;
const Message = Jymfony.Component.HttpFoundation.Websocket.Message;

/**
 * Utility class to decode a websocket frame.
 *
 * @memberOf Jymfony.Component.HttpFoundation.Websocket
 * @internal
 */
class FrameBuffer {
    /**
     * Constructor.
     */
    __construct() {
        /**
         * Temporary buffer.
         *
         * @type {Buffer}
         *
         * @private
         */
        this._buffer = Buffer.allocUnsafe(0);

        /**
         * Incomplete frames buffer.
         *
         * @type {Jymfony.Component.HttpFoundation.Websocket.Frame[]}
         *
         * @private
         */
        this._frames = [];
    }

    /**
     * Adds data, generates decoded messages.
     *
     * @param {Buffer} data
     *
     * @returns {IterableIterator<Jymfony.Component.HttpFoundation.Websocket.Message>}
     */
    * concat(data) {
        this._buffer = Buffer.concat([ this._buffer, data ]);
        let ret;

        while (true) {
            ret = Frame.fromBuffer(this._buffer);
            if (! ret) {
                return;
            }

            [ data, this._buffer ] = ret;

            switch (data.opcode) {
                case 0x8:
                    throw new CloseFrameException(
                        new Message(data.buffer, Message.TYPE_BINARY)
                    );

                case 0x9:
                    // Ping frame.
                    yield new Message(null, Message.TYPE_PING);
                    break;

                case 0xA:
                    // Pong frame. Ignore
                    break;

                default:
                    this._addFrame(data);

                    if (data.fin) {
                        yield this._buildMessage();
                    }

                    break;
            }
        }
    }

    /**
     * Adds a frame to the buffer.
     *
     * @param {Jymfony.Component.HttpFoundation.Websocket.Frame} frame
     *
     * @private
     */
    _addFrame(frame) {
        if (0 < this._frames.length && 0 !== frame.opcode) {
            throw new BadFrameException('Bad frame received. Closing connection.');
        }

        this._frames.push(frame);
    }

    /**
     * Builds a message from the buffered frames.
     *
     * @returns {Jymfony.Component.HttpFoundation.Websocket.Message}
     *
     * @private
     */
    _buildMessage() {
        const message = new Message(
            Buffer.concat(this._frames.map(pkt => pkt.buffer)),
            1 === this._frames[0].opcode ? Message.TYPE_TEXT : Message.TYPE_BINARY
        );

        this._frames = [];
        return message;
    }
}

module.exports = FrameBuffer;
