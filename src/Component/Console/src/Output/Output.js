const OutputFormatter = Jymfony.Component.Console.Formatter.OutputFormatter;
const OutputInterface = Jymfony.Component.Console.Output.OutputInterface;

/**
 * @memberOf Jymfony.Component.Console.Output
 */
export default class Output extends implementationOf(OutputInterface) {
    /**
     * Constructor.
     *
     * @param {string} [verbosity = Jymfony.Component.Console.Output.ConsoleOutputInterface.VERBOSITY_NORMAL]
     * @param {boolean} [decorated = false]
     * @param {Jymfony.Component.Console.Formatter.OutputFormatterInterface} [formatter = new Jymfony.Component.Console.Formatter.OutputFormatter()]
     */
    __construct(verbosity = OutputInterface.VERBOSITY_NORMAL, decorated = false, formatter = new OutputFormatter()) {
        this._verbosity = undefined === verbosity ? OutputInterface.VERBOSITY_NORMAL : verbosity;
        this._formatter = formatter;
        this.decorated = decorated;
    }

    /**
     * @inheritdoc
     */
    write(messages, newline = false, options = 0) {
        if (! isArray(messages)) {
            messages = [ messages ];
        }

        const types = OutputInterface.OUTPUT_NORMAL | OutputInterface.OUTPUT_RAW | OutputInterface.OUTPUT_PLAIN;
        const type = (types & options || OutputInterface.OUTPUT_NORMAL);

        const verbosities = OutputInterface.VERBOSITY_QUIET | OutputInterface.VERBOSITY_NORMAL | OutputInterface.VERBOSITY_VERBOSE | OutputInterface.VERBOSITY_VERY_VERBOSE | OutputInterface.VERBOSITY_DEBUG;
        const verbosity = (verbosities & options || OutputInterface.VERBOSITY_NORMAL);

        if (verbosity > this.verbosity) {
            return;
        }

        for (let message of messages) {
            switch (type) {
                case OutputInterface.OUTPUT_NORMAL:
                    message = this._formatter.format(message);
                    break;
                case OutputInterface.OUTPUT_RAW:
                    break;
                case OutputInterface.OUTPUT_PLAIN:
                    message = __jymfony.strip_tags(this._formatter.format(message));
                    break;
            }

            this._doWrite(message, newline);
        }
    }

    /**
     * @inheritdoc
     */
    writeln(messages = '', options = 0) {
        this.write(messages, true, options);
    }

    /**
     * @inheritdoc
     */
    set verbosity(level) {
        this._verbosity = ~~level;
    }

    /**
     * @inheritdoc
     */
    get verbosity() {
        return this._verbosity;
    }

    /**
     * @inheritdoc
     */
    isQuiet() {
        return OutputInterface.VERBOSITY_QUIET === this._verbosity;
    }

    /**
     * @inheritdoc
     */
    isVerbose() {
        return OutputInterface.VERBOSITY_VERBOSE <= this._verbosity;
    }

    /**
     * @inheritdoc
     */
    isVeryVerbose() {
        return OutputInterface.VERBOSITY_VERY_VERBOSE <= this._verbosity;
    }

    /**
     * @inheritdoc
     */
    isDebug() {
        return OutputInterface.VERBOSITY_DEBUG <= this._verbosity;
    }

    /**
     * @inheritdoc
     */
    set decorated(decorated) {
        this._formatter.decorated = decorated;
    }

    /**
     * @inheritdoc
     */
    get decorated() {
        return this._formatter.decorated;
    }

    /**
     * @inheritdoc
     */
    set formatter(formatter) {
        this._formatter = formatter;
    }

    /**
     * @inheritdoc
     */
    get formatter() {
        return this._formatter;
    }

    /**
     * Writes a message to the output.
     *
     * @param {string} message A message to write to the output
     * @param {boolean} newline Whether to add a newline or not
     *
     * @protected
     */
    _doWrite(message, newline) { // eslint-disable-line no-unused-vars
        throw new RuntimeException('You must override the _doWrite method');
    }
}
