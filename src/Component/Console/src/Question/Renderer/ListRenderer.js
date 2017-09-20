const AbstractRenderer = Jymfony.Component.Console.Question.Renderer.AbstractRenderer;

/**
 * Renders a ChoiceQuestion as list.
 *
 * This class is internal and should be considered private
 * DO NOT USE this directly.
 *
 * @internal
 * @memberOf Jymfony.Component.Console.Question.Renderer
 */
class ListRenderer extends AbstractRenderer {
    __construct(question) {
        super.__construct(question);

        /**
         * Prompt lines.
         *
         * @type {int|undefined}
         *
         * @private
         */
        this._linesCount = undefined;

        /**
         * Current selected index.
         *
         * @type {int}
         *
         * @protected
         */
        this._current = 0;

        /**
         * Carriage-Return received.
         *
         * @type {boolean}
         * @private
         */
        this._cr = false;

        /**
         * Input data event listener.
         *
         * @type {function(*)|undefined}
         *
         * @private
         */
        this._dataCallback = undefined;
    }

    /**
     * @inheritDoc
     */
    doAsk() {
        this._print();

        const p = new Promise(resolve => {
            this._promiseResolve = resolve;
        });

        this._input.setRawMode(true);
        this._input.on('data', this._dataCallback = (data) => this._onData(data));
        this._input.resume();

        return p;
    }

    /**
     * Input stream data event handler.
     *
     * @param {Buffer} data
     *
     * @protected
     */
    _onData(data) {
        const char = data.toString();

        switch (char) {
            case '\x03': {
                this._input.setRawMode(false);
                this._output.write('\x1B[?25h');
                process.kill(process.pid, 'SIGINT');
            } break;

            case '\r': {
                setTimeout(() => {
                    if (this._cr) {
                        this._resolve();
                    }

                    this._cr = false;
                }, 100);

                this._cr = true;
            } break;

            case '\n': {
                this._cr = false;
                this._resolve();
            } break;

            case '\x1B[\x41': {
                this._current = Math.max(this._current - 1, 0);
                this._print();
            } break;

            case '\x1B[\x42': {
                this._current = Math.min(this._current + 1, this._question._choices.length - 1);
                this._print();
            } break;

            default: {
                // Do nothing.
            } break;
        }
    }

    /**
     * Renders a choice label.
     *
     * @param {Jymfony.Component.Console.Question.Choice} choice
     * @param {int} key
     *
     * @protected
     */
    _renderChoice(choice, key) {
        return ' > ' + choice.label;
    }

    /**
     * Gets the current choice value(s).
     *
     * @returns {*}
     *
     * @protected
     */
    _getValue() {
        return this._question._choices[this._current].value;
    }

    /**
     * Print prompt
     *
     * @protected
     */
    _print() {
        if (undefined !== this._linesCount) {
            this._output.write('\x1B[' + this._linesCount + 'A');
            this._output.write('\x1B[J');
        }

        let p = this._outputFormatter.format('[<info>?</info>] ' + this._question._question + '\n');

        for (let key = 0; key < this._question._choices.length; key++) {
            const choice = this._question._choices[key];
            let msg = this._renderChoice(choice, key);

            if (this._current === key) {
                msg = '<info>' + msg + '</info>';
            }

            p += this._outputFormatter.format(msg + '\n');
        }

        this._output.write('\x1B[?25l');
        this._output.write(p);
        this._linesCount = p.split('\n').length - 1;
    }

    /**
     * Resolve promise.
     *
     * @private
     */
    _resolve() {
        this._output.write('\x1B[?25h');

        this._input.setRawMode(false);
        this._input.removeListener('data', this._dataCallback);
        this._input.pause();

        this._linesCount = undefined;
        this._promiseResolve(this._getValue());
    }
}

module.exports = ListRenderer;
