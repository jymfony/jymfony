const ConsoleEvent = Jymfony.Component.Console.Event.ConsoleEvent;

/**
 * Allows to do things before the command is executed, like skipping the command or changing the input.
 *
 * @memberOf Jymfony.Component.Console.Event
 */
class ConsoleCommandEvent extends ConsoleEvent {
    __construct(command = undefined, input, output) {
        super.__construct(command, input, output);

        /**
         * Indicates if the command should be run or skipped.
         *
         * @type {boolean}
         * @private
         */
        this._commandShouldRun = true;
    }

    /**
     * Returns true if the command is runnable, false otherwise.
     *
     * @returns {boolean}
     */
    get commandShouldRun() {
        return this._commandShouldRun;
    }

    /**
     * Disables the command.
     */
    disableCommand() {
        this._commandShouldRun = false;
    }

    /**
     * Enables the command.
     */
    enableCommand() {
        this._commandShouldRun = true;
    }
}

/**
 * The return code for skipped commands, this will also be passed into the terminate event.
 */
ConsoleCommandEvent.RETURN_CODE_DISABLED = 113;

module.exports = ConsoleCommandEvent;
