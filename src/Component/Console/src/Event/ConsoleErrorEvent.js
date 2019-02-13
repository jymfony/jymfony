const ConsoleEvent = Jymfony.Component.Console.Event.ConsoleEvent;
const InvalidArgumentException = Jymfony.Component.Console.Exception.InvalidArgumentException;

/**
 * Allows to handle throwables thrown while running a command.
 *
 * @memberOf Jymfony.Component.Console.Event
 */
class ConsoleErrorEvent extends ConsoleEvent {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Console.Input.InputInterface} input
     * @param {Jymfony.Component.Console.Output.OutputInterface} output
     * @param {Error} error
     * @param {Jymfony.Component.Console.Command.Command} [command]
     */
    __construct(input, output, error, command = undefined) {
        super.__construct(command, input, output);

        /**
         * The thrown error.
         *
         * @type {Error}
         *
         * @private
         */
        this._error = undefined;

        /**
         * The process exit code.
         *
         * @type {int}
         *
         * @private
         */
        this._exitCode = undefined;

        this.error = error;
    }

    /**
     * Returns the thrown error/exception.
     *
     * @returns {Error}
     */
    get error() {
        return this._error;
    }

    /**
     * Replaces the thrown error/exception.
     *
     * @param {Error} error
     */
    set error(error) {
        if (! (error instanceof Error)) {
            throw new InvalidArgumentException(__jymfony.sprintf(
                'The error passed to ConsoleErrorEvent must be an instance of Error, "%s" was passed instead.',
                ReflectionClass.getClassName(error)
            ));
        }

        this._error = error;
    }

    /**
     * Sets the exit code.
     *
     * @param {int} exitCode The command exit code
     */
    set exitCode(exitCode) {
        this._exitCode = ~~exitCode;

        if (this._error instanceof Exception) {
            this._error.code = exitCode;
        }
    }

    /**
     * Gets the exit code.
     *
     * @returns {int} The command exit code
     */
    get exitCode() {
        return undefined !== this._exitCode ? this._exitCode : (this._error.code || 1);
    }
}

module.exports = ConsoleErrorEvent;
