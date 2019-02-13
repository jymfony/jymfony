'use strict';

const { Writable } = require('stream');
const INITIAL_SIZE = 7 * 1024;
const SIZE_INCREMENT = 4 * 1024;

class StreamBuffer extends Writable {
    /**
     * Constructor.
     */
    constructor() {
        super();

        this._size = 0;
        this._bufSize = INITIAL_SIZE;
        this._buffer = Buffer.alloc(INITIAL_SIZE);
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
