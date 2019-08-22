const OutputFormatter = Jymfony.Component.Console.Formatter.OutputFormatter;
const ConsoleOutputInterface = Jymfony.Component.Console.Output.ConsoleOutputInterface;
const StreamOutput = Jymfony.Component.Console.Output.StreamOutput;

/**
 * @memberOf Jymfony.Component.Console.Output
 */
export default class ConsoleOutput extends mix(StreamOutput, ConsoleOutputInterface) {
    /**
     * Constructor.
     *
     * @param {int} [verbosity = Jymfony.Component.Console.Output.ConsoleOutputInterface.VERBOSITY_NORMAL]
     * @param {boolean} [decorated]
     * @param {Jymfony.Component.Console.Formatter.OutputFormatterInterface} [formatter]
     */
    __construct(verbosity = ConsoleOutputInterface.VERBOSITY_NORMAL, decorated = undefined, formatter = new OutputFormatter()) {
        super.__construct(process.stdout, verbosity, decorated, formatter);

        const actualDecorated = this.decorated;
        this._stderr = new StreamOutput(process.stderr, verbosity, decorated, this.formatter);

        if (undefined === decorated) {
            this.decorated = actualDecorated && this._stderr.decorated;
        }
    }

    /**
     * @inheritdoc
     */
    set decorated(decorated) {
        super.decorated = decorated;

        if (this._stderr) {
            this._stderr.decorated = decorated;
        }
    }

    /**
     * @inheritdoc
     */
    get decorated() {
        return super.decorated;
    }

    /**
     * @inheritdoc
     */
    set formatter(formatter) {
        super.formatter = formatter;

        if (this._stderr) {
            this._stderr.formatter = formatter;
        }
    }

    /**
     * @inheritdoc
     */
    get formatter() {
        return super.formatter;
    }

    /**
     * @inheritdoc
     */
    set verbosity(level) {
        super.verbosity = level;

        if (this._stderr) {
            this._stderr.verbosity = level;
        }
    }

    /**
     * @inheritdoc
     */
    get verbosity() {
        return super.verbosity;
    }

    /**
     * @inheritdoc
     */
    get errorOutput() {
        return this._stderr;
    }

    /**
     * @inheritdoc
     */
    set errorOutput(error) {
        this._stderr = error;
    }
}
