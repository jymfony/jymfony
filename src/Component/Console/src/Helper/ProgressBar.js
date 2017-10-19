const LogicException = Jymfony.Component.Console.Exception.LogicException;
const Helper = Jymfony.Component.Console.Helper.Helper;
const OutputInterface = Jymfony.Component.Console.Output.OutputInterface;
const ConsoleOutputInterface = Jymfony.Component.Console.Output.ConsoleOutputInterface;
const Terminal = Jymfony.Component.Console.Terminal;
const DateTime = Jymfony.Component.DateTime.DateTime;

/**
 * The ProgressBar provides helpers to display progress output.
 *
 * @memberOf Jymfony.Component.Console.Helper
 * @final
 */
class ProgressBar {
    /**
     * @param {Jymfony.Component.Console.Output.OutputInterface} output An OutputInterface instance
     * @param {int} max Maximum steps (0 if unknown)
     */
    __construct(output, max = 0) {
        // Options
        this._barWidth = 28;
        this.emptyBarCharacter = '-';
        this.progressCharacter = '>';
        this._redrawFreq = 1;

        this._step = 0;
        this._percent = 0.0;
        this._messages = {};
        this._overwrite = true;
        this._firstRun = true;

        if (output instanceof ConsoleOutputInterface) {
            output = output.errorOutput;
        }

        /**
         * @var OutputInterface
         */
        this._output = output;
        this.maxSteps = max;
        this._terminal = new Terminal();

        if (! this._output.decorated) {
            // Disable overwrite when output does not support ANSI codes.
            this._overwrite = false;

            // Set a reasonable redraw frequency so output isn't flooded
            this.redrawFrequency = max / 10;
        }

        this._startTime = DateTime.unixTime;
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
        if (! Object.keys(ProgressBar.formatters).length) {
            ProgressBar.formatters = ProgressBar._initPlaceholderFormatters();
        }

        ProgressBar.formatters[name] = callable;
    }

    /**
     * Gets the placeholder formatter for a given name.
     *
     * @param {string} name The placeholder name (including the delimiter char like %)
     *
     * @returns {Function|undefined}
     */
    static getPlaceholderFormatterDefinition(name) {
        if (! Object.keys(ProgressBar.formatters).length) {
            ProgressBar.formatters = ProgressBar._initPlaceholderFormatters();
        }

        return ProgressBar.formatters[name];
    }

    /**
     * Sets a format for a given name.
     *
     * This method also allow you to override an existing format.
     *
     * @param {string} name The format name
     * @param {string} format A format string
     */
    static setFormatDefinition(name, format) {
        if (! Object.keys(ProgressBar.formats).length) {
            ProgressBar.formats = ProgressBar._initFormats();
        }

        ProgressBar.formats[name] = format;
    }

    /**
     * Gets the format for a given name.
     *
     * @param {string} name The format name
     *
     * @returns {string|undefined} A format string
     */
    static getFormatDefinition(name) {
        if (! Object.keys(ProgressBar.formats).length) {
            ProgressBar.formats = ProgressBar._initFormats();
        }

        return ProgressBar.formats[name];
    }

    /**
     * Associates a text with a named placeholder.
     *
     * The text is displayed when the progress bar is rendered but only
     * when the corresponding placeholder is part of the custom format line
     * (by wrapping the name with %).
     *
     * @param {string} message The text to associate with the placeholder
     * @param {string} name The name of the placeholder
     */
    setMessage(message, name = 'message') {
        this._messages[name] = message;
    }

    getMessage(name = 'message') {
        return this._messages[name];
    }

    /**
     * Gets the progress bar start time.
     *
     * @returns {int} The progress bar start time
     */
    get startTime() {
        return this._startTime;
    }

    /**
     * Gets the progress bar maximal steps.
     *
     * @returns {int} The progress bar max steps
     */
    get maxSteps() {
        return this._max;
    }

    /**
     * Sets the progress bar maximal steps.
     *
     * @param {int} max The progress bar max steps
     * @private
     */
    set maxSteps(max) {
        this._max = Math.max(0, ~~max);
        this._stepWidth = this._max ? this._max.toString().length : 4;
    }

    /**
     * Gets the current step position.
     *
     * @returns {int} The progress bar step
     */
    get progress() {
        return this._step;
    }

    /**
     * Gets the current progress bar percent.
     *
     * @returns {float} The current progress bar percent
     */
    get progressPercent() {
        return this._percent;
    }

    /**
     * Sets the progress bar width.
     *
     * @param {int} size The progress bar size
     */
    set barWidth(size) {
        this._barWidth = Math.max(1, ~~size);
    }

    /**
     * Gets the progress bar width.
     *
     * @returns {int} The progress bar size
     */
    get barWidth() {
        return this._barWidth;
    }

    /**
     * Sets the bar character.
     *
     * @param {string} char A character
     */
    set barCharacter(char) {
        this._barChar = char;
    }

    /**
     * Gets the bar character.
     *
     * @returns {string} A character
     */
    get barCharacter() {
        if (! this._barChar) {
            return this._max ? '=' : this.emptyBarCharacter;
        }

        return this._barChar;
    }

    /**
     * Sets the progress bar format.
     *
     * @param {string} format The format
     */
    set format(format) {
        this._format = undefined;
        this._internalFormat = format;
    }

    /**
     * Sets the redraw frequency.
     *
     * @param {int|float} freq The frequency in steps
     */
    set redrawFrequency(freq) {
        this._redrawFreq = Math.max(~~freq, 1);
    }

    /**
     * Starts the progress output.
     *
     * @param {int|null} max Number of steps to complete the bar (0 if indeterminate), null to leave unchanged
     */
    start(max = undefined) {
        this._startTime = DateTime.unixTime;
        this._step = 0;
        this._percent = 0.0;

        if (max) {
            this.maxSteps = max;
        }

        this.display();
    }

    /**
     * Advances the progress output X steps.
     *
     * @param {int} step Number of steps to advance
     */
    advance(step = 1) {
        this.progress = this._step + step;
    }

    /**
     * Sets whether to overwrite the progressbar, false for new line.
     *
     * @param {boolean} overwrite
     */
    set overwrite(overwrite) {
        this._overwrite = !! overwrite;
    }

    /**
     * Sets the current progress.
     *
     * @param {int} step The current progress
     */
    set progress(step) {
        step = ~~step;

        if (this._max && step > this._max) {
            this._max = step;
        } else if (0 > step) {
            step = 0;
        }

        const prevPeriod = ~~(this._step / this._redrawFreq);
        const currPeriod = ~~(step / this._redrawFreq);
        this._step = step;
        this._percent = this._max ? this._step / this._max : 0;
        if (prevPeriod !== currPeriod || this._max === step) {
            this.display();
        }
    }

    /**
     * Finishes the progress output.
     */
    finish() {
        if (! this._max) {
            this._max = this._step;
        }

        if (this._step === this._max && ! this._overwrite) {
            // Prevent double 100% output
            return;
        }

        this.progress = this._max;
    }

    /**
     * Outputs the current progress string.
     */
    display() {
        if (OutputInterface.VERBOSITY_QUIET === this._output.verbosity) {
            return;
        }

        if (! this._format) {
            this.realFormat = this._internalFormat || this._determineBestFormat();
        }

        this._ow(this._buildLine());
    }

    /**
     * Removes the progress bar from the current line.
     *
     * This is useful if you wish to write some output
     * while a progress bar is running.
     * Call display() to show the progress bar again.
     */
    clear() {
        if (! this._overwrite) {
            return;
        }

        if (! this._format) {
            this.realFormat = this._internalFormat || this._determineBestFormat();
        }

        this._ow('');
    }

    /**
     * Sets the progress bar format.
     *
     * @param {string} format The format
     */
    set realFormat(format) {
        // Try to use the _nomax variant if available
        if (! this._max && ProgressBar.getFormatDefinition(format + '_nomax')) {
            this._format = ProgressBar.getFormatDefinition(format + '_nomax');
        } else if (ProgressBar.getFormatDefinition(format)) {
            this._format = ProgressBar.getFormatDefinition(format);
        } else {
            this._format = format;
        }

        this._formatLineCount = this._format.split('\n').length - 1;
    }

    /**
     * Overwrites a previous message to the output.
     *
     * @param {string} message The message
     * @private
     */
    _ow(message) {
        if (this._overwrite) {
            if (! this._firstRun) {
                // Move the cursor to the beginning of the line
                this._output.write('\x0D');

                // Erase the line
                this._output.write('\x1B[2K');

                // Erase previous lines
                if (0 < this._formatLineCount) {
                    this._output.write('\x1B[1A\x1B[2K'.repeat(this._formatLineCount));
                }
            }
        } else if (0 < this._step) {
            this._output.writeln('');
        }

        this._firstRun = false;
        this._output.write(message);
    }

    _determineBestFormat() {
        switch (this._output.verbosity) {
            // OutputInterface::VERBOSITY_QUIET: display is disabled anyway
            case OutputInterface.VERBOSITY_VERBOSE:
                return this._max ? 'verbose' : 'verbose_nomax';
            case OutputInterface.VERBOSITY_VERY_VERBOSE:
                return this._max ? 'very_verbose' : 'very_verbose_nomax';
            case OutputInterface.VERBOSITY_DEBUG:
                return this._max ? 'debug' : 'debug_nomax';
            default:
                return this._max ? 'normal' : 'normal_nomax';
        }
    }

    /**
     * @private
     */
    static _initPlaceholderFormatters() {
        return {
            /**
             * @param {Jymfony.Component.Console.Helper.ProgressBar} bar
             * @param {Jymfony.Component.Console.Output.OutputInterface} output
             *
             * @returns {string}
             */
            bar: (bar, output) => {
                const completeBars = ~~(0 < bar.maxSteps ? bar.progressPercent * bar.barWidth : bar.progress % bar.barWidth);
                let display = bar.barCharacter.repeat(completeBars);
                if (completeBars < bar.barWidth) {
                    const emptyBars = bar.barWidth - completeBars - Helper.strlenWithoutDecoration(output.formatter, bar.progressCharacter);
                    display += bar.progressCharacter + bar.emptyBarCharacter.repeat(emptyBars);
                }

                return display;
            },
            /**
             * @param {Jymfony.Component.Console.Helper.ProgressBar} bar
             *
             * @returns {string}
             */
            elapsed: (bar) => {
                return Helper.formatTime(DateTime.unixTime - bar.startTime);
            },
            /**
             * @param {Jymfony.Component.Console.Helper.ProgressBar} bar
             *
             * @returns {string}
             */
            remaining: (bar) => {
                if (! bar.maxSteps) {
                    throw new LogicException('Unable to display the remaining time if the maximum number of steps is not set.');
                }

                let remaining;
                if (! bar._step) {
                    remaining = 0;
                } else {
                    remaining = Math.round((DateTime.unixTime - bar.startTime) / bar.progress * (bar.maxSteps - bar.progress));
                }

                return Helper.formatTime(remaining);
            },
            /**
             * @param {Jymfony.Component.Console.Helper.ProgressBar} bar
             *
             * @returns {string}
             */
            estimated: (bar) => {
                if (! bar.maxSteps) {
                    throw new LogicException('Unable to display the estimated time if the maximum number of steps is not set.');
                }

                let estimated;
                if (! bar.progress) {
                    estimated = 0;
                } else {
                    estimated = Math.round((DateTime.unixTime - bar.startTime) / bar.progress * bar.maxSteps);
                }

                return Helper.formatTime(estimated);
            },
            /**
             * @returns {string}
             */
            memory: () => {
                const usage = process.memoryUsage();
                return Helper.formatMemory(usage.rss + usage.heapTotal + usage.external);
            },
            /**
             * @param {Jymfony.Component.Console.Helper.ProgressBar} bar
             *
             * @returns {string}
             */
            current: (bar) => {
                const progress = bar.progress.toString();
                return ' '.repeat(bar._stepWidth - progress.length) + progress;
            },
            /**
             * @param {Jymfony.Component.Console.Helper.ProgressBar} bar
             *
             * @returns {string}
             */
            max: (bar) => {
                return bar.maxSteps.toString();
            },
            /**
             * @param {Jymfony.Component.Console.Helper.ProgressBar} bar
             *
             * @returns {string}
             */
            percent: (bar) => {
                return ~~(bar.progressPercent * 100).toString();
            },
        };
    }

    /**
     * @private
     */
    static _initFormats() {
        return {
            normal: ' %current%/%max% [%bar%] %percent:3s%%',
            normal_nomax: ' %current% [%bar%]',

            verbose: ' %current%/%max% [%bar%] %percent:3s%% %elapsed:6s%',
            verbose_nomax: ' %current% [%bar%] %elapsed:6s%',

            very_verbose: ' %current%/%max% [%bar%] %percent:3s%% %elapsed:6s%/%estimated:-6s%',
            very_verbose_nomax: ' %current% [%bar%] %elapsed:6s%',

            debug: ' %current%/%max% [%bar%] %percent:3s%% %elapsed:6s%/%estimated:-6s% %memory:6s%',
            debug_nomax: ' %current% [%bar%] %elapsed:6s% %memory:6s%',
        };
    }

    /**
     * @returns {string}
     */
    _buildLine() {
        const regex = new RegExp('%([a-z\-_]+)(?:\:([^%]+))?%', 'ig');
        const callback = (string, match1, match2) => {
            let text, formatter;
            if (formatter = ProgressBar.getPlaceholderFormatterDefinition(match1)) {
                text = formatter(this, this._output);
            } else if (this._messages[match1]) {
                text = this._messages[match1];
            } else {
                return string;
            }

            if (match2) {
                text = __jymfony.sprintf('%'+match2, text);
            }

            return text;
        };

        const line = this._format.replace(regex, callback);

        // Gets string length for each sub line with multiline format
        const linesLength = line.split('\n')
            .map(subLine => Helper.strlenWithoutDecoration(this._output.formatter, __jymfony.rtrim(subLine, '\r')));
        const linesWidth = Math.max(...linesLength);

        const terminalWidth = this._terminal.width;
        if (linesWidth <= terminalWidth) {
            return line;
        }

        this.barWidth = this.barWidth - linesWidth + terminalWidth;

        return this._format.replace(regex, callback);
    }
}

ProgressBar.formatters = {};
ProgressBar.formats = {};

module.exports = ProgressBar;
