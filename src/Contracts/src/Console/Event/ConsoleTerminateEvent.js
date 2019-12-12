const ConsoleEvent = Jymfony.Contracts.Console.Event.ConsoleEvent;

/**
 * Allows to manipulate the exit code of a command after its execution.
 *
 * @memberOf Jymfony.Contracts.Console.Event
 */
export default class ConsoleTerminateEvent extends ConsoleEvent {
    /**
     * Constructor.
     *
     * @param {Jymfony.Contracts.Console.CommandInterface} [command]
     * @param {Jymfony.Contracts.Console.InputInterface} input
     * @param {Jymfony.Contracts.Console.OutputInterface} output
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
