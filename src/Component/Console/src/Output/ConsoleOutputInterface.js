const OutputInterface = Jymfony.Console.Output.OutputInterface;

/**
 * @memberOf Jymfony.Console.Output
 * @type ConsoleOutputInterface
 *
 * @interface
 */
class ConsoleOutputInterface extends OutputInterface.definition {
    /**
     * Gets the OutputInterface for errors.
     *
     * @returns {Jymfony.Console.Output.OutputInterface}
     */
    get errorOutput() { }

    /**
     * Sets the OutputInterface used for errors.
     *
     * @param {Jymfony.Console.Output.OutputInterface} error
     */
    set errorOutput(error) { }
}

module.exports = getInterface(ConsoleOutputInterface);
