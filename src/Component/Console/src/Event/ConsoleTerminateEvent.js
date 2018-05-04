const ConsoleEvent = Jymfony.Component.Console.Event.ConsoleEvent;

/**
 * Allows to manipulate the exit code of a command after its execution.
 *
 * @memberOf Jymfony.Component.Console.Event
 */
class ConsoleTerminateEvent extends ConsoleEvent {
    /**
     * @inheritdoc
     *
     * @param {int} exitCode
     */
    __construct(command, input, output, exitCode) {
        super.__construct(command, input, output);
        this.exitCode = exitCode;
    }

    /**
     * Sets the exit code.
     *
     * @param {int} exitCode The command exit code
     */
    set exitCode(exitCode) {
        this._exitCode = ~~exitCode;
    }

    /**
     * Gets the exit code.
     *
     * @returns {int} The command exit code
     */
    get exitCode() {
        return this._exitCode;
    }
}

module.exports = ConsoleTerminateEvent;
