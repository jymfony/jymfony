import { EOL } from 'os';

const InvalidArgumentException = Jymfony.Component.Console.Exception.InvalidArgumentException;
const OutputFormatter = Jymfony.Component.Console.Formatter.OutputFormatter;
const Output = Jymfony.Component.Console.Output.Output;
const OutputInterface = Jymfony.Component.Console.Output.OutputInterface;
const Terminal = Jymfony.Component.Console.Terminal;

/**
 * @memberOf Jymfony.Component.Console.Output
 */
export default class StreamOutput extends Output {
    /**
     * @type {NodeJS.WritableStream}
     *
     * @private
     */
    _stream;

    /**
     * @type {boolean}
     *
     * @private
     */
    _deferUncork = true;

    /**
     * Constructor.
     *
     * @param {NodeJS.WritableStream} stream
     * @param {int} [verbosity = Jymfony.Component.Console.Output.ConsoleOutputInterface.VERBOSITY_NORMAL]
     * @param {boolean} [decorated]
     * @param {Jymfony.Component.Console.Formatter.OutputFormatterInterface} [formatter = new Jymfony.Component.Console.Output.OutputFormatter()]
     */
    __construct(stream, verbosity = OutputInterface.VERBOSITY_NORMAL, decorated = undefined, formatter = new OutputFormatter()) {
        if (! isStream(stream) || ! stream.writable) {
            throw new InvalidArgumentException('Argument 1 should be an instance of stream.Writable');
        }

        super.__construct(verbosity, decorated, formatter);

        this._stream = stream;
        this._deferUncork = true;

        if (undefined === decorated) {
            this.decorated = this._hasColorSupport();
        }
    }

    /**
     * Gets the underlying stream object.
     *
     * @returns {NodeJS.WritableStream}
     */
    get stream() {
        return this._stream;
    }

    /**
     * Sets whether the uncork should be deferred to process.nextTick
     * or should be called immediately.
     *
     * @param {boolean} defer
     */
    set deferUncork(defer) {
        this._deferUncork = defer;
    }

    /**
     * @inheritdoc
     */
    _doWrite(message, newline) {
        this._stream.cork();

        this._stream.write(message);
        if (newline) {
            this._stream.write(EOL);
        }

        if (this._deferUncork) {
            process.nextTick(() => this._stream.uncork());
        } else {
            this._stream.uncork();
        }
    }

    /**
     * Determine if the stream supports colors
     *
     * @returns {boolean}
     *
     * @private
     */
    _hasColorSupport() {
        if (! this._stream.isTTY) {
            return false;
        }

        return Terminal.hasANSISupport;
    }
}

module.exports = StreamOutput;
