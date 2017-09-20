const os = require('os');
const stream = require('stream');

const ArrayInput = Jymfony.Component.Console.Input.ArrayInput;
const ConsoleOutput = Jymfony.Component.Console.Output.ConsoleOutput;
const OutputInterface = Jymfony.Component.Console.Output.OutputInterface;
const StreamOutput = Jymfony.Component.Console.Output.StreamOutput;

/**
 * @memberOf Jymfony.Component.Console.Tester
 */
class ApplicationTester {
    /**
     * @param {Jymfony.Component.Console.Application} application
     */
    __construct(application) {
        /**
         * @type {Jymfony.Component.Console.Application}
         * @private
         */
        this._application = application;
    }

    /**
     * Executes the application.
     *
     * Options:
     *  * interactive      Sets the input interactive flag [false]
     *  * decorated        Sets the decorated flag [false]
     *  * verbosity        Sets the output verbosity level [VERBOSITY_NORMAL]
     *  * stderr           Whether to capture stderr separately from stdout [false]
     *
     * @param {Object.<string, *>} input
     * @param {Object<string, boolean|*>} options
     */
    run(input, options = {}) {
        /**
         * @type {string}
         * @private
         */
        this._readOutput = '';

        /**
         * @type {string}
         * @private
         */
        this._readStdErr = '';

        /**
         * @type {Jymfony.Component.Console.Input.ArrayInput}
         * @private
         */
        this._input = new ArrayInput(input);

        /**
         * @type {int}
         * @private
         */
        this._statusCode = undefined;

        if (options.interactive) {
            this._input.interactive = true;
        }

        this._captureStdErrSeparately = !! options.stderr;
        if (! this._captureStdErrSeparately) {
            this._output = new StreamOutput(new stream.PassThrough());
            this._output.deferUncork = false;

            if (options.verbosity) {
                this._output.verbosity = options.verbosity;
            }

            if (options.decorated !== undefined) {
                this._output.decorated = options.decorated;
            }
        } else {
            this._output = new ConsoleOutput(
                options.verbosity || OutputInterface.VERBOSITY_NORMAL,
                !! options.decorated
            );
            this._output.deferUncork = false;

            const stdErr = new StreamOutput(new stream.PassThrough());
            stdErr.formatter = this._output.formatter;
            stdErr.verbosity = this._output.verbosity;
            stdErr.decorated = this._output.decorated;
            stdErr.deferUncork = false;

            this._output._stderr = stdErr;
            this._output._stream = new stream.PassThrough();
        }

        return this._application.run(this._input, this._output)
            .then(statusCode => {
                process.exitCode = undefined;

                return this._statusCode = statusCode;
            });
    }

    /**
     * Gets the display returned by the last execution of the application.
     *
     * @param {boolean} normalize Whether to normalize end of lines to \n or not
     *
     * @returns {string}
     */
    getDisplay(normalize = false) {
        /** @type {Buffer} */
        const read = this._output.stream.read();
        if (null !== read) {
            this._readOutput += read.toString();
        }

        return normalize ? this._readOutput.replace(new RegExp(os.EOL, 'g'), '\n') : this._readOutput;
    }

    /**
     * Gets the output written to STDERR by the application.
     *
     * @param {boolean} normalize Whether to normalize end of lines to \n or not
     *
     * @returns {string}
     *
     * @throws {LogicException} If application has not run with stderr option.
     */
    getErrorDisplay(normalize = false) {
        if (! this._captureStdErrSeparately) {
            throw new LogicException('The error output is not available when the tester is run without "stderr" option set.');
        }

        /** @type {Buffer} */
        const read = this._output._stderr.stream.read();
        if (null !== read) {
            this._readStdErr += read.toString();
        }

        return normalize ? this._readStdErr.replace(new RegExp(os.EOL, 'g'), '\n') : this._readStdErr;
    }

    /**
     * Gets the input instance used by the last execution of application.
     *
     * @returns {Jymfony.Component.Console.Input.InputInterface}
     */
    get input() {
        return this._input;
    }

    /**
     * Gets the output instance used by the last execution of application.
     *
     * @returns {Jymfony.Component.Console.Output.OutputInterface}
     */
    get output() {
        return this._output;
    }

    /**
     * Gets the status code returned by the last execution of the application
     * if run has been completed.
     *
     * @returns {int}
     */
    get exitCode() {
        return this._statusCode;
    }
}

module.exports = ApplicationTester;
