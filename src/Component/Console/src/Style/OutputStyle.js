const ConsoleOutputInterface = Jymfony.Component.Console.Output.ConsoleOutputInterface;
const OutputInterface = Jymfony.Component.Console.Output.OutputInterface;
const os = require('os');

/**
 * Decorates output to add console style guide helpers.
 *
 * @memberOf Jymfony.Component.Console.Style
 */
class OutputStyle extends implementationOf(OutputInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Console.Output.OutputInterface} output
     */
    __construct(output) {
        /**
         * @type {Jymfony.Component.Console.Output.OutputInterface}
         * @private
         */
        this._output = output;
    }

    /**
     * @inheritDoc
     */
    newLine(count = 1) {
        this._output.write(os.EOL.repeat(count));
    }

    /**
     * @inheritDoc
     */
    write(messages, newline = false, options = 0) {
        return this._output.write(messages, newline, options);
    }

    /**
     * @inheritDoc
     */
    writeln(messages = '', options = 0) {
        return this._output.writeln(messages, options);
    }

    /**
     * @inheritDoc
     */
    set verbosity(level) {
        this._output.verbosity = level;
    }

    /**
     * @inheritDoc
     */
    get verbosity() {
        return this._output.verbosity;
    }

    /**
     * @inheritDoc
     */
    isQuiet() {
        return this._output.isQuiet();
    }

    /**
     * @inheritDoc
     */
    isVerbose() {
        return this._output.isVerbose();
    }

    /**
     * @inheritDoc
     */
    isVeryVerbose() {
        return this._output.isVeryVerbose();
    }

    /**
     * @inheritDoc
     */
    isDebug() {
        return this._output.isDebug();
    }

    /**
     * @inheritDoc
     */
    set decorated(decorated) {
        this._output.decorated = decorated;
    }

    /**
     * @inheritDoc
     */
    get decorated() {
        return this._output.decorated;
    }

    /**
     * @inheritDoc
     */
    set formatter(formatter) {
        this._output.formatter = formatter;
    }

    /**
     * @inheritDoc
     */
    get formatter() {
        return this._output.formatter;
    }

    /**
     * Gets the error output.
     *
     * @returns {Jymfony.Component.Console.Output.OutputInterface}
     * @protected
     */
    _getErrorOutput() {
        if (this._output instanceof ConsoleOutputInterface) {
            return this._output.errorOutput;
        }

        return this._output;
    }
}

module.exports = OutputStyle;
