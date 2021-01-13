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

global.__jymfony = global.__jymfony || {};
__jymfony.BlackHoleStream = BlackHoleStream;
