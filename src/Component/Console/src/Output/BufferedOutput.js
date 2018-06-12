const Output = Jymfony.Component.Console.Output.Output;
const os = require('os');

/**
 * @memberOf Jymfony.Component.Console.Output
 */
class BufferedOutput extends Output {
    /**
     * @inheritdoc
     */
    __construct(verbosity = OutputInterface.VERBOSITY_NORMAL, decorated = false, formatter = new OutputFormatter()) {
        super.__construct(verbosity, decorated, formatter);

        /**
         * @type {string}
         *
         * @private
         */
        this._buffer = '';
    }

    /**
     * Empties buffer and returns its content.
     *
     * @returns {string}
     */
    fetch() {
        const content = this._buffer;
        this._buffer = '';

        return content;
    }

    /**
     * @inheritdoc
     */
    _doWrite(message, newline) {
        this._buffer += message;

        if (newline) {
            this._buffer += os.EOL;
        }
    }
}

module.exports = BufferedOutput;
