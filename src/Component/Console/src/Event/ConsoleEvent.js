const Event = Jymfony.Component.EventDispatcher.Event;

/**
 * Allows to inspect input and output of a command.
 *
 * @memberOf Jymfony.Component.Console.Event
 */
class ConsoleEvent extends Event {
    __construct(command = null, input, output) {
        super.__construct();

        /**
         * @type {Jymfony.Component.Console.Command.Command}
         * @protected
         */
        this._command = command;

        /**
         * @type {Jymfony.Component.Console.Input.InputInterface}
         * @private
         */
        this._input = input;

        /**
         * @type {Jymfony.Component.Console.Output.OutputInterface}
         * @private
         */
        this._output = output;
    }

    /**
     * Gets the command that is executed.
     *
     * @returns {undefined|Jymfony.Component.Console.Command.Command} A Command instance
     */
    get command() {
        return this._command;
    }

    /**
     * Gets the input instance.
     *
     * @returns {Jymfony.Component.Console.Input.InputInterface} An InputInterface instance
     */
    get input() {
        return this._input;
    }

    /**
     * Gets the output instance.
     *
     * @returns {Jymfony.Component.Console.Output.OutputInterface} An OutputInterface instance
     */
    get output() {
        return this._output;
    }
}

module.exports = ConsoleEvent;
