const OutputInterface = Jymfony.Component.Console.Output.OutputInterface;
const OutputFormatter = Jymfony.Component.Console.Formatter.OutputFormatter;

/**
 * @memberOf Jymfony.Component.Console.Output
 *
 * @final
 */
class NullOutput extends implementationOf(OutputInterface) {
    /**
     * @inheritDoc
     */
    write() { }

    /**
     * @inheritDoc
     */
    writeln() { }

    /**
     * @inheritDoc
     */
    set verbosity(level) { }

    /**
     * @inheritDoc
     */
    get verbosity() {
        return OutputInterface.VERBOSITY_QUIET;
    }

    /**
     * @inheritDoc
     */
    isQuiet() {
        return true;
    }

    /**
     * @inheritDoc
     */
    isVerbose() {
        return false;
    }

    /**
     * @inheritDoc
     */
    isVeryVerbose() {
        return false;
    }

    /**
     * @inheritDoc
     */
    isDebug() {
        return false;
    }

    /**
     * @inheritDoc
     */
    set decorated(decorated) { }

    /**
     * @inheritDoc
     */
    get decorated() {
        return false;
    }

    /**
     * @inheritDoc
     */
    set formatter(formatter) { }

    /**
     * @inheritDoc
     */
    get formatter() {
        return new OutputFormatter();
    }
}

module.exports = NullOutput;
