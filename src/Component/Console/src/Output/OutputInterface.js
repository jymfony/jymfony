const ContractsOutputInterface = Jymfony.Contracts.Console.OutputInterface;

/**
 * @memberOf Jymfony.Component.Console.Output
 *
 * @interface
 */
class OutputInterface extends ContractsOutputInterface.definition {
    /**
     * Sets output formatter.
     *
     * @param {Jymfony.Component.Console.Formatter.OutputFormatterInterface} formatter
     */
    set formatter(formatter) { }

    /**
     * Returns current output formatter instance.
     *
     * @returns {Jymfony.Component.Console.Formatter.OutputFormatterInterface}
     */
    get formatter() { }
}

export default getInterface(OutputInterface);
