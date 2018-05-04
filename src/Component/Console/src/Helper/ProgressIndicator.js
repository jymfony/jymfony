const InvalidArgumentException = Jymfony.Component.Console.Exception.InvalidArgumentException;
const LogicException = Jymfony.Component.Console.Exception.LogicException;
const Helper = Jymfony.Component.Console.Helper.Helper;
const OutputInterface = Jymfony.Component.Console.Output.OutputInterface;
const Terminal = Jymfony.Component.Console.Terminal;
const DateTime = Jymfony.Component.DateTime.DateTime;

/**
 * @memberOf Jymfony.Component.Console.Helper
 *
 * @final
 */
class ProgressIndicator {
    /**
     * @param {Jymfony.Component.Console.Output.OutputInterface} output
     * @param {string|undefined} [format] Indicator format
     * @param {int} [indicatorChangeInterval = 100] Change interval in milliseconds
     * @param {string[]|undefined} [indicatorValues] Animated indicator characters
     */
    __construct(output, format = undefined, indicatorChangeInterval = 100, indicatorValues = undefined) {
        /**
         * @type {boolean}
         *
         * @private
         */
        this._started = false;

        /**
         * @type {Jymfony.Component.Console.Output.OutputInterface}
         *
         * @private
         */
        this._output = output;

        if (! format) {
            format = this._determineBestFormat();
        }

        if (! indicatorValues) {
            indicatorValues = this._getDefaultIndicators();
        }

        if (2 > indicatorValues.length) {
            throw new InvalidArgumentException('Must have at least 2 indicator value characters.');
        }

        /**
         * @type {string}
         *
         * @private
         */
        this._format = ProgressIndicator.getFormatDefinition(format);

        /**
         * @type {int}
         *
         * @private
         */
        this._indicatorChangeInterval = indicatorChangeInterval;

        /**
         * @type {string[]}
         *
         * @private
         */
        this._indicatorValues = indicatorValues;

        /**
         * @type {int}
         *
         * @private
         */
        this._startTime = DateTime.unixTime;
    }

    /**
     * Sets the current indicator message.
     *
     * @param {string|undefined} message
     */
    set message(message) {
        this._message = message;

        this._display();
    }

    /**
     * Starts the indicator output.
     *
     * @param {string|undefined} [message = '']
     */
    start(message = '') {
        if (this._started) {
            throw new LogicException('Progress indicator already started.');
        }

        this._message = message;
        this._started = true;
        this._startTime = DateTime.unixTime;
        this._indicatorUpdateTime = this._getCurrentTimeInMilliseconds() + this._indicatorChangeInterval;
        this._indicatorCurrent = 0;

        this._display();
    }

    /**
     * Advances the indicator.
     */
    advance() {
        if (! this._started) {
            throw new LogicException('Progress indicator has not yet been started.');
        }

        if (! this._output.decorated) {
            return;
        }

        const currentTime = this._getCurrentTimeInMilliseconds();
        if (currentTime < this._indicatorUpdateTime) {
            return;
        }

        this._indicatorUpdateTime = currentTime + this._indicatorChangeInterval;
        ++this._indicatorCurrent;

        this._display();
    }

    /**
     * Finish the indicator with message.
     *
     * @param {string|undefined} [message = '']
     */
    finish(message = '') {
        if (! this._started) {
            throw new LogicException('Progress indicator has not yet been started.');
        }

        this._message = message;
        this._display();
        this._output.writeln();
        this._started = false;
    }

    /**
     * Gets the format for a given name.
     *
     * @param {string} name The format name
     *
     * @returns {string|undefined} A format string
     */
    static getFormatDefinition(name) {
        if (! Object.keys(ProgressIndicator.formats).length) {
            ProgressIndicator.formats = ProgressIndicator.initFormats();
        }

        return ProgressIndicator.formats[name];
    }

    /**
     * Sets a placeholder formatter for a given name.
     *
     * This method also allow you to override an existing placeholder.
     *
     * @param {string} name The placeholder name (including the delimiter char like %)
     * @param {Function} callable
     */
    static setPlaceholderFormatterDefinition(name, callable) {
        if (! Object.keys(ProgressIndicator.formatters).length) {
            ProgressIndicator.formatters = ProgressIndicator.initPlaceholderFormatters();
        }

        ProgressIndicator.formatters[name] = callable;
    }

    /**
     * Gets the placeholder formatter for a given name.
     *
     * @param {string} name The placeholder name (including the delimiter char like %)
     *
     * @returns {Function|undefined}
     */
    static getPlaceholderFormatterDefinition(name) {
        if (! Object.keys(ProgressIndicator.formatters).length) {
            ProgressIndicator.formatters = ProgressIndicator.initPlaceholderFormatters();
        }

        return ProgressIndicator.formatters[name];
    }

    /**
     * @private
     */
    _display() {
        if (OutputInterface.VERBOSITY_QUIET === this._output.verbosity) {
            return;
        }

        this._overwrite(this._format.replace(new RegExp('%([a-z\-_]+)(?:\:([^%]+))?%', 'ig'), (str, match1) => {
            let formatter;
            if (formatter = ProgressIndicator.getPlaceholderFormatterDefinition(match1)) {
                return formatter(this);
            }

            return str;
        }));
    }

    /**
     * @returns {string}
     *
     * @private
     */
    _determineBestFormat() {
        switch (this._output.verbosity) {
            // OutputInterface::VERBOSITY_QUIET: display is disabled anyway
            case OutputInterface.VERBOSITY_VERBOSE:
                return this._output.decorated ? 'verbose' : 'verbose_no_ansi';
            case OutputInterface.VERBOSITY_VERY_VERBOSE:
            case OutputInterface.VERBOSITY_DEBUG:
                return this._output.decorated ? 'very_verbose' : 'very_verbose_no_ansi';
            default:
                return this._output.decorated ? 'normal' : 'normal_no_ansi';
        }
    }

    /**
     * Overwrites a previous message to the output.
     *
     * @param {string} message The message
     */
    _overwrite(message) {
        if (this._output.decorated) {
            this._output.write('\x0D\x1B[2K');
            this._output.write(message);
        } else {
            this._output.writeln(message);
        }
    }

    /**
     * @returns {int}
     *
     * @private
     */
    _getCurrentTimeInMilliseconds() {
        const now = DateTime.now;
        return ~~(now.timestamp * 1000 + now.millisecond);
    }

    /**
     * @returns {string[]}
     *
     * @private
     */
    _getDefaultIndicators() {
        if (this._output.decorated && Terminal.hasUnicodeSupport) {
            return [ '⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏' ];
        }

        return [ '-', '\\', '|', '/' ];
    }

    /**
     * @returns {Object.<string, Function>}
     */
    static initPlaceholderFormatters() {
        return {
            /**
             * @type {Jymfony.Component.Console.Helper.ProgressIndicator} indicator
             *
             * @returns {string}
             */
            indicator: (indicator) => {
                return indicator._indicatorValues[indicator._indicatorCurrent % indicator._indicatorValues.length];
            },
            /**
             * @param {Jymfony.Component.Console.Helper.ProgressIndicator} indicator
             *
             * @returns {string}
             */
            message: (indicator) => {
                return indicator._message;
            },
            /**
             * @param {Jymfony.Component.Console.Helper.ProgressIndicator} indicator
             *
             * @returns {string}
             */
            elapsed: (indicator) => {
                return Helper.formatTime(DateTime.unixTime - indicator._startTime);
            },
            /**
             * @returns {string}
             */
            memory: () => {
                const usage = process.memoryUsage();
                return Helper.formatMemory(usage.rss + usage.heapTotal + usage.external);
            },
        };
    }

    /**
     * @returns {Object.<string, string>}
     */
    static initFormats() {
        return {
            normal: ' %indicator% %message%',
            normal_no_ansi: ' %message%',

            verbose: ' %indicator% %message% (%elapsed:6s%)',
            verbose_no_ansi: ' %message% (%elapsed:6s%)',

            very_verbose: ' %indicator% %message% (%elapsed:6s%, %memory:6s%)',
            very_verbose_no_ansi: ' %message% (%elapsed:6s%, %memory:6s%)',
        };
    }
}

ProgressIndicator.formatters = {};
ProgressIndicator.formats = {};

module.exports = ProgressIndicator;
