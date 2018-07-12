const AbstractRenderer = Jymfony.Component.Console.Question.Renderer.AbstractRenderer;

/**
 * Renders a PasswordQuestion prompt using stdin in raw mode
 * to hide password or echo.
 * This class is internal and should be considered private
 * DO NOT USE this directly.
 *
 * @memberOf Jymfony.Component.Console.Question.Renderer
 *
 * @internal
 */
class PasswordRenderer extends AbstractRenderer {
    /**
     * @inheritdoc
     */
    __construct(question) {
        super.__construct(question);

        /**
         * Carriage-Return received.
         *
         * @type {boolean}
         *
         * @private
         */
        this._cr = false;

        /**
         * Received data buffer.
         *
         * @type {Buffer}
         *
         * @private
         */
        this._buffer = Buffer.allocUnsafe(0);
    }

    /**
     * @inheritdoc
     */
    doAsk() {
        this._output.write('[<info>?</info>] ' + this._question._question + ' ');

        if (this._input.isTTY) {
            this._input.setRawMode(true);
        }

        const p = new Promise((resolve) => {
            /**
             * @type {function(*)}
             * @private
             */
            this._promiseResolve = resolve;
        });

        this._input.on('data', this._dataCallback = (data) => this._onData(data));
        this._input.resume();

        return p;
    }

    /**
     * @private
     */
    _resolve() {
        if (this._input.isTTY) {
            this._input.setRawMode(false);
        }

        this._input.removeListener('data', this._dataCallback);
        this._input.pause();
        this._output.write('\n');

        this._promiseResolve(this._buffer.toString());
        this._buffer = Buffer.allocUnsafe(0);
    }

    /**
     * Callback for stream "data" event.
     *
     * @param {Buffer} data
     *
     * @private
     */
    _onData(data) {
        let buf;

        // UTF-8 decode.
        while (0 < data.length) {
            let offset = 0;
            const char = data[offset];
            if (0xF0 === (char & 0xF0)) {
                buf = Buffer.from([ char, data[++offset], data[++offset], data[++offset] ]);
            } else if (0xE0 === (char & 0xE0)) {
                buf = Buffer.from([ char, data[++offset], data[++offset] ]);
            } else if (0xC0 === (char & 0xC0)) {
                buf = Buffer.from([ char, data[++offset] ]);
            } else {
                buf = Buffer.from([ char ]);
            }

            this._onChar(buf.toString());
            data = data.slice(++offset);
        }
    }

    /**
     * @param {string} char
     *
     * @private
     */
    _onChar(char) {
        switch (char) {
            case '\x03': {
                process.kill(process.pid, 'SIGINT');
            } break;

            case '\r': {
                setTimeout(() => {
                    if (this._cr) {
                        this._buffer = Buffer.concat([ this._buffer, Buffer.from(char) ]);
                        this._resolve();
                    }

                    this._cr = false;
                }, 100);

                this._cr = true;
            } break;

            case '\n': {
                this._cr = false;
                this._buffer = Buffer.concat([ this._buffer, Buffer.from(char) ]);
                this._resolve();
            } break;

            default: {
                this._buffer = Buffer.concat([ this._buffer, Buffer.from(char) ]);

                if (! this._question.hidden) {
                    this._output.write(this._question.mask);
                }
            } break;
        }
    }
}

module.exports = PasswordRenderer;
