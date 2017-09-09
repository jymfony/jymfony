const ConsoleEvents = Jymfony.Component.Console.ConsoleEvents;
const OutputInterface = Jymfony.Component.Console.Output.OutputInterface;
const ConsoleOutputInterface = Jymfony.Component.Console.Output.ConsoleOutputInterface;
const EventSubscriberInterface = Jymfony.Component.EventDispatcher.EventSubscriberInterface;
const ConsoleFormatter = Jymfony.Component.Logger.Formatter.ConsoleFormatter;
const AbstractProcessingHandler = Jymfony.Component.Logger.Handler.AbstractProcessingHandler;
const LogLevel = Jymfony.Component.Logger.LogLevel;

const DEFAULT_VERBOSITY_MAP = {
    [OutputInterface.VERBOSITY_QUIET]: LogLevel.ERROR,
    [OutputInterface.VERBOSITY_NORMAL]: LogLevel.WARNING,
    [OutputInterface.VERBOSITY_VERBOSE]: LogLevel.NOTICE,
    [OutputInterface.VERBOSITY_VERY_VERBOSE]: LogLevel.INFO,
    [OutputInterface.VERBOSITY_DEBUG]: LogLevel.DEBUG,
};

/**
 * @memberOf Jymfony.Component.Logger.Handler
 */
class ConsoleHandler extends mix(AbstractProcessingHandler, EventSubscriberInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Console.Output.OutputInterface} output
     * @param {boolean} bubble
     * @param {Object} verbosityLevelMap
     */
    __construct(output = undefined, bubble = true, verbosityLevelMap = DEFAULT_VERBOSITY_MAP) {
        super.__construct(LogLevel.DEBUG, bubble);

        this._output = output;
        this._verbosityLevelMap = verbosityLevelMap;
    }

    /**
     * @inheritDoc
     */
    isHandling(record) {
        return this._updateLevel() && super.isHandling(record);
    }

    /**
     * @inheritDoc
     */
    handle(record) {
        // We have to update the logging level each time because the verbosity of the
        // Console output might have changed in the meantime (it is not immutable)
        return this._updateLevel() && super.handle(record);
    }

    /**
     * Disables the output.
     */
    close() {
        this._output = undefined;
    }

    /**
     * Before a command is executed, the handler gets activated and the console output
     * is set in order to know where to write the logs.
     *
     * @param {Jymfony.Component.Console.Event.ConsoleCommandEvent} event
     */
    onCommand(event) {
        let output = event.output;
        if (output instanceof ConsoleOutputInterface) {
            output = output.errorOutput;
        }

        this._output = output;
    }

    /**
     * After a command has been executed, it disables the output.
     */
    onTerminate() {
        this.close();
    }

    /**
     * @inheritDoc
     */
    static getSubscribedEvents() {
        return {
            [ConsoleEvents.COMMAND]: [ 'onCommand', 255 ],
            [ConsoleEvents.TERMINATE]: [ 'onTerminate', -255 ],
        };
    }

    /**
     * @inheritDoc
     */
    getDefaultFormatter() {
        if (undefined === this._output) {
            return new ConsoleFormatter();
        }

        return new ConsoleFormatter({
            colors: this._output.decorated,
            multiline: OutputInterface.VERBOSITY_DEBUG <= this._output.verbosity,
        });
    }

    /**
     * @inheritDoc
     */
    _write(record) {
        // At this point we've determined for sure that we want to output the record, so use the output's own verbosity
        this._output.write(record['formatted'].toString(), false, this._output.verbosity);
    }

    /**
     * Updates the logging level based on the verbosity setting of the console output.
     *
     * @returns {boolean} Whether the handler is enabled and verbosity is not set to quiet.
     *
     * @private
     */
    _updateLevel() {
        if (undefined === this._output) {
            return false;
        }

        const verbosity = this._output.verbosity;
        if (this._verbosityLevelMap[verbosity]) {
            this.level = this._verbosityLevelMap[verbosity];
        } else {
            this.level = LogLevel.DEBUG;
        }

        return true;
    }
}

module.exports = ConsoleHandler;
