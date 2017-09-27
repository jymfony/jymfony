const ConsoleOutputInterface = Jymfony.Component.Console.Output.ConsoleOutputInterface;
const StreamOutput = Jymfony.Component.Console.Output.StreamOutput;

/**
 * @memberOf Jymfony.Component.Console.Output
 */
class ConsoleOutput extends mix(StreamOutput, ConsoleOutputInterface) {
    __construct(verbosity = ConsoleOutputInterface.VERBOSITY_NORMAL, decorated = undefined, formatter = undefined) {
        super.__construct(process.stdout, verbosity, decorated, formatter);

        const actualDecorated = this.decorated;
        this._stderr = new StreamOutput(process.stderr, verbosity, decorated, this.formatter);

        if (undefined === decorated) {
            this.decorated = actualDecorated && this._stderr.decorated;
        }
    }

    /**
     * @inheritDoc
     */
    set decorated(decorated) {
        super.decorated = decorated;

        if (this._stderr) {
            this._stderr.decorated = decorated;
        }
    }

    /**
     * @inheritDoc
     */
    get decorated() {
        return super.decorated;
    }

    /**
     * @inheritDoc
     */
    set formatter(formatter) {
        super.formatter = formatter;

        if (this._stderr) {
            this._stderr.formatter = formatter;
        }
    }

    /**
     * @inheritDoc
     */
    get formatter() {
        return super.formatter;
    }

    /**
     * @inheritDoc
     */
    set verbosity(level) {
        super.verbosity = level;

        if (this._stderr) {
            this._stderr.verbosity = level;
        }
    }

    /**
     * @inheritDoc
     */
    get verbosity() {
        return super.verbosity;
    }

    /**
     * @inheritDoc
     */
    get errorOutput() {
        return this._stderr;
    }

    /**
     * @inheritDoc
     */
    set errorOutput(error) {
        this._stderr = error;
    }
}

module.exports = ConsoleOutput;
