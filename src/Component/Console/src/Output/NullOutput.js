const OutputInterface = Jymfony.Component.Console.Output.OutputInterface;
const OutputFormatter = Jymfony.Component.Console.Formatter.OutputFormatter;

/**
 * @memberOf Jymfony.Component.Console.Output
 *
 * @final
 */
export default class NullOutput extends implementationOf(OutputInterface) {
    /**
     * @inheritdoc
     */
    write() { }

    /**
     * @inheritdoc
     */
    writeln() { }

    /**
     * @inheritdoc
     */
    set verbosity(level) { }

    /**
     * @inheritdoc
     */
    get verbosity() {
        return OutputInterface.VERBOSITY_QUIET;
    }

    /**
     * @inheritdoc
     */
    isQuiet() {
        return true;
    }

    /**
     * @inheritdoc
     */
    isVerbose() {
        return false;
    }

    /**
     * @inheritdoc
     */
    isVeryVerbose() {
        return false;
    }

    /**
     * @inheritdoc
     */
    isDebug() {
        return false;
    }

    /**
     * @inheritdoc
     */
    set decorated(decorated) { }

    /**
     * @inheritdoc
     */
    get decorated() {
        return false;
    }

    /**
     * @inheritdoc
     */
    set formatter(formatter) { }

    /**
     * @inheritdoc
     */
    get formatter() {
        return new OutputFormatter();
    }
}
