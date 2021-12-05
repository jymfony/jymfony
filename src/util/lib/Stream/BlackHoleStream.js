'use strict';

const { Writable } = require('stream');
class BlackHoleStream extends Writable {
    /**
     * @inheritdoc
     */
    _write(chunk, encoding, callback) {
        // Do nothing and call tha callback function.
        callback();
    }
}

globalThis.__jymfony = globalThis.__jymfony || {};
__jymfony.BlackHoleStream = BlackHoleStream;
