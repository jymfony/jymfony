const Event = Jymfony.Contracts.EventDispatcher.Event;

/**
 * Allows to inspect input and output of a command.
 *
 * @memberOf Jymfony.Contracts.Console.Event
 */
export default class ConsoleEvent extends Event {
    /**
     * Constructor.
     *
     * @param {Jymfony.Contracts.Console.CommandInterface} [command]
     * @param {Jymfony.Contracts.Console.InputInterface} input
     * @param {Jymfony.Contracts.Console.OutputInterface} output
     */
    __construct(command = undefined, input, output) {
        super.__construct();

        /**
         * @type {Jymfony.Contracts.Console.CommandInterface}
         *
         * @protected
         */
        this._command = command;

        /**
         * @type {Jymfony.Contracts.Console.InputInterface}
         *
         * @private
         */
        this._input = input;

        /**
         * @type {Jymfony.Contracts.Console.OutputInterface}
         *
         * @private
         */
        this._output = output;
    }

    /**
     * Gets the command that is executed.
     *
     * @returns {undefined|Jymfony.Contracts.Console.CommandInterface} A Command instance
     */
    get command() {
        return this._command;
    }

    /**
     * Gets the input instance.
     *
     * @returns {Jymfony.Contracts.Console.InputInterface} An InputInterface instance
     */
    get input() {
        return this._input;
    }

    /**
     * Gets the output instance.
     *
     * @returns {Jymfony.Contracts.Console.OutputInterface} An OutputInterface instance
     */
    get output() {
        return this._output;
    }
}
