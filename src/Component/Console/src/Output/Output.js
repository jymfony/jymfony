const OutputFormatter = Jymfony.Component.Console.Formatter.OutputFormatter;
const OutputInterface = Jymfony.Component.Console.Output.OutputInterface;

/**
 * @memberOf Jymfony.Component.Console.Output
 * @type Output
 */
module.exports = class Output extends implementationOf(OutputInterface) {
    constructor(verbosity = OutputInterface.VERBOSITY_NORMAL, decorated = false, formatter = new OutputFormatter()) {
        super();

        this._verbosity = undefined === verbosity ? OutputInterface.VERBOSITY_NORMAL : verbosity;
        this._formatter = formatter;
        this.decorated = decorated;
    }

    /**
     * @inheritDoc
     */
    write(messages, newline = false, options = 0) {
        if (! isArray(messages)) {
            messages = [ messages ];
        }

        let types = OutputInterface.OUTPUT_NORMAL | OutputInterface.OUTPUT_RAW | OutputInterface.OUTPUT_PLAIN;
        let type = (types & options || OutputInterface.OUTPUT_NORMAL);

        let verbosities = OutputInterface.VERBOSITY_QUIET | OutputInterface.VERBOSITY_NORMAL | OutputInterface.VERBOSITY_VERBOSE | OutputInterface.VERBOSITY_VERY_VERBOSE | OutputInterface.VERBOSITY_DEBUG;
        let verbosity = (verbosities & options || OutputInterface.VERBOSITY_NORMAL);

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
     * @inheritDoc
     */
    writeln(messages, options = 0) {
        this.write(messages, true, options);
    }

    /**
     * @inheritDoc
     */
    set verbosity(level) {
        this._verbosity = ~~level;
    }

    /**
     * @inheritDoc
     */
    get verbosity() {
        return this._verbosity;
    }

    /**
     * @inheritDoc
     */
    isQuiet() {
        return OutputInterface.VERBOSITY_QUIET === this._verbosity;
    }

    /**
     * @inheritDoc
     */
    isVerbose() {
        return OutputInterface.VERBOSITY_VERBOSE === this._verbosity;
    }

    /**
     * @inheritDoc
     */
    isVeryVerbose() {
        return OutputInterface.VERBOSITY_VERY_VERBOSE === this._verbosity;
    }

    /**
     * @inheritDoc
     */
    isDebug() {
        return OutputInterface.VERBOSITY_DEBUG === this._verbosity;
    }

    /**
     * @inheritDoc
     */
    set decorated(decorated) {
        this._formatter.decorated = decorated;
    }

    /**
     * @inheritDoc
     */
    get decorated() {
        return this._formatter.decorated;
    }

    /**
     * @inheritDoc
     */
    set formatter(formatter) {
        this._formatter = formatter;
    }

    /**
     * @inheritDoc
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
    _doWrite(message, newline) {
        throw new RuntimeException('You must override the _doWrite method');
    }
};
