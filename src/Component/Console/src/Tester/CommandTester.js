const os = require('os');
const stream = require('stream');

const ArrayInput = Jymfony.Component.Console.Input.ArrayInput;
const StreamOutput = Jymfony.Component.Console.Output.StreamOutput;

/**
 * @memberOf Jymfony.Component.Console.Tester
 */
class CommandTester {
    /**
     * @param {Jymfony.Component.Console.Command.Command} command
     */
    __construct(command) {
        /**
         * @type {Jymfony.Component.Console.Command.Command}
         * @private
         */
        this._command = command;

        /**
         * @type {[string]}
         * @private
         */
        this._inputs = [];
    }

    /**
     * Executes the application.
     *
     * Options:
     *  * interactive      Sets the input interactive flag [false]
     *  * decorated        Sets the decorated flag [false]
     *  * verbosity        Sets the output verbosity level [VERBOSITY_NORMAL]
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

        // set the command name automatically if the application requires
        // this argument and no command name was passed
        if (! input.command
            && this._command.application
            && this._command.application.definition.hasArgument('command')
        ) {
            input = Object.assign({}, { command: this._command.name }, input);
        }

        /**
         * @type {Jymfony.Component.Console.Input.ArrayInput}
         * @private
         */
        this._input = new ArrayInput(input);

        if (this._inputs.length) {
            this._input.stream = CommandTester._createStream(this._inputs);
        }

        /**
         * @type {int}
         * @private
         */
        this._statusCode = undefined;
        this._input.interactive = !! options.interactive;

        this._output = new StreamOutput(new stream.PassThrough());
        this._output.deferUncork = false;
        this._output.decorated = !! options.decorated;

        if (options.verbosity) {
            this._output.verbosity = options.verbosity;
        }

        return __jymfony.Async.run(this._command.run(this._input, this._output))
            .then(statusCode => {
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
        let read = this._output.stream.read();
        if (null !== read) {
            this._readOutput += read.toString();
        }

        return normalize ? this._readOutput.replace(new RegExp(os.EOL, 'g'), '\n') : this._readOutput;
    }

    /**
     * Sets the user inputs.
     *
     * @param {[string]} inputs
     */
    set inputs(inputs) {
        this._inputs = inputs;
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

    /**
     * Create a stream with given inputs.
     *
     * @param {[string]} inputs
     *
     * @private
     */
    static _createStream(inputs) {
        const s = new stream.Readable();
        s.deferUncork = false;

        for (let line of inputs) {
            s.push(line);
        }

        return s;
    }
}

module.exports = CommandTester;
