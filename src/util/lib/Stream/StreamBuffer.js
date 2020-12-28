'use strict';

const { Duplex } = require('stream');
const INITIAL_SIZE = 7 * 1024;
const SIZE_INCREMENT = 4 * 1024;

class StreamBuffer extends Duplex {
    /**
     * Constructor.
     *
     * @param {Buffer} [buffer]
     */
    constructor(buffer = null) {
        super();

        if (null === buffer) {
            buffer = Buffer.allocUnsafe(INITIAL_SIZE);
            this._size = 0;
        } else {
            this._size = buffer.length;
        }

        this._position = 0;
        this._bufSize = buffer.length;
        this._buffer = buffer;
    }

    copy() {
        return new __jymfony.StreamBuffer(Buffer.from(this._buffer));
    }

    /**
     * Gets the buffer.
     *
     * @returns {Buffer}
     */
    get buffer() {
        return this._buffer.slice(0, this._size);
    }

    /**
     * The size of the data contained in the buffer.
     *
     * @returns {int}
     */
    get size() {
        return this._size;
    }

    /**
     * @param {number} size
     *
     * @returns {void}
     */
    _read(size) {
        let result = true;
        do {
            if (this._position + size >= this._size) {
                size = this._size - this._position;
            }

            if (0 === size) {
                this.push(null);
                return;
            }

            result = this.push(this._buffer.slice(this._position, this._position + size));
            this._position += size;
        } while (result);
    }

    /**
     * @inheritdoc
     */
    _write(chunk, encoding, callback) {
        try {
            if (! isBuffer(chunk)) {
                chunk = Buffer.from(chunk, encoding);
            }

            if (this._size + chunk.length > this._bufSize) {
                const buffer = Buffer.alloc(this._bufSize += SIZE_INCREMENT);
                this._buffer.copy(buffer);

                this._buffer = buffer;
                return this._write(chunk, encoding, callback);
            }

            chunk.copy(this._buffer, this._size);
            this._size += chunk.length;

            callback();
        } catch (e) {
            callback(e);
        }
    }
}

global.__jymfony = global.__jymfony || {};
__jymfony.StreamBuffer = StreamBuffer;
