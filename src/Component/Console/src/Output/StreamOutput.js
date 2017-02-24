const InvalidArgumentException = Jymfony.Component.Console.Exception.InvalidArgumentException;
const OutputFormatter = Jymfony.Component.Console.Formatter.OutputFormatter;
const Output = Jymfony.Component.Console.Output.Output;
const OutputInterface = Jymfony.Component.Console.Output.OutputInterface;

const stream = require('stream');
const os = require("os");

/**
 * @memberOf Jymfony.Component.Console.Output
 * @type StreamOutput
 */
module.exports = class StreamOutput extends Output {
    constructor(stream, verbosity = OutputInterface.VERBOSITY_NORMAL, decorated = undefined, formatter = new OutputFormatter()) {
        if (! isStream(stream) || ! stream.writable) {
            throw new InvalidArgumentException('Argument 1 should be an instance of stream.Writable');
        }

        super(verbosity, decorated, formatter);

        /**
         * @type stream.Writable
         */
        this._stream = stream;

        if (undefined === decorated) {
            this.decorated = this._hasColorSupport();
        }
    }

    /**
     * @inheritDoc
     */
    _doWrite(message, newline) {
        this._stream.cork();

        this._stream.write(message);
        if (newline) {
            this._stream.write(os.EOL);
        }

        process.nextTick(() => this._stream.uncork());
    }

    /**
     * Determine if the stream supports colors
     *
     * @returns {boolean}
     *
     * @private
     */
    _hasColorSupport() {
        if ('win32' === os.platform()) {
            return (
                !! process.env['ANSICON'] ||
                'ON' === process.env['ConEmuANSI'] ||
                'xterm' === process.env['TERM'] ||
                __jymfony.version_compare(os.release(), '10.0.10586', '>=')
            );
        }

        return !! this._stream.isTTY;
    }
};
