import { EOL } from 'os';

const Terminal = Jymfony.Component.Console.Terminal;
const BufferedOutput = Jymfony.Component.Console.Output.BufferedOutput;
const OutputFormatter = Jymfony.Component.Console.Formatter.OutputFormatter;
const OutputInterface = Jymfony.Component.Console.Output.OutputInterface;
const Helper = Jymfony.Component.Console.Helper.Helper;
const ProgressBar = Jymfony.Component.Console.Helper.ProgressBar;
const ProgressIndicator = Jymfony.Component.Console.Helper.ProgressIndicator;
const OutputStyle = Jymfony.Component.Console.Style.OutputStyle;
const QuestionBuilder = Jymfony.Component.Console.Question.Builder.QuestionBuilder;
const QuestionType = Jymfony.Component.Console.Question.QuestionType;

/**
 * Output decorator helpers for the Symfony Style Guide.
 *
 * @memberOf Jymfony.Component.Console.Style
 */
export default class JymfonyStyle extends OutputStyle {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Console.Input.InputInterface} input
     * @param {Jymfony.Component.Console.Output.OutputInterface} output
     */
    __construct(input, output) {
        /**
         * @type {Jymfony.Component.Console.Input.InputInterface}
         *
         * @private
         */
        this._input = input;

        /**
         * @type {Jymfony.Component.Console.Output.BufferedOutput}
         *
         * @private
         */
        this._bufferedOutput = new BufferedOutput(output.verbosity, false, __jymfony.clone(output.formatter));

        // Windows cmd wraps lines as soon as the terminal width is reached, whether there are following chars or not.
        const width = (new Terminal()).width || JymfonyStyle.MAX_LINE_LENGTH;

        /**
         * @type {int}
         *
         * @private
         */
        this._lineLength = Math.min(width - (__jymfony.Platform.isWindows ? 1 : 0), JymfonyStyle.MAX_LINE_LENGTH);

        /**
         * @type {undefined|Jymfony.Component.Console.Helper.ProgressBar|Jymfony.Component.Console.Helper.ProgressIndicator}
         *
         * @private
         */
        this._progress = undefined;

        super.__construct(output);
    }

    /**
     * Formats a message as a block of text.
     *
     * @param {string|string[]} messages The message to write in the block
     * @param {undefined|string} [type] The block type (added in [] on first line)
     * @param {undefined|string} [style] The style to apply to the whole block
     * @param {string} [prefix = ' '] The prefix for the block
     * @param {boolean} [padding = false] Whether to add vertical padding
     * @param {boolean} [escape = true] Whether to escape the message
     */
    block(messages, type = undefined, style = undefined, prefix = ' ', padding = false, escape = true) {
        messages = isArray(messages) ? messages : [ messages ];

        this._autoPrependBlock();
        this.writeln(this._createBlock(messages, type, style, prefix, padding, escape));
        this.newLine();
    }

    /**
     * @inheritdoc
     */
    title(message) {
        this._autoPrependBlock();
        this.writeln([
            __jymfony.sprintf('<comment>%s</>', OutputFormatter.escapeTrailingBackslash(message)),
            __jymfony.sprintf('<comment>%s</>', '='.repeat(Helper.strlenWithoutDecoration(this.formatter, message))),
        ]);
        this.newLine();
    }

    /**
     * @inheritdoc
     */
    section(message) {
        this._autoPrependBlock();
        this.writeln([
            __jymfony.sprintf('<comment>%s</>', OutputFormatter.escapeTrailingBackslash(message)),
            __jymfony.sprintf('<comment>%s</>', '-'.repeat(Helper.strlenWithoutDecoration(this.formatter, message))),
        ]);
        this.newLine();
    }

    /**
     * @inheritdoc
     */
    listing(elements) {
        this._autoPrependText();
        elements = elements.map(element => __jymfony.sprintf(' * %s', element));

        this.writeln(elements);
        this.newLine();
    }

    /**
     * @inheritdoc
     */
    text(messages) {
        this._autoPrependText();

        messages = isArray(messages) ? messages : [ messages ];
        for (const message of messages) {
            this.writeln(' ' + message);
        }
    }

    /**
     * Formats a command comment.
     *
     * @param {string|string[]} message
     */
    comment(message) {
        this.block(message, undefined, undefined, '<fg=default;bg=default> // </>', false, false);
    }

    /**
     * @inheritdoc
     */
    success(message) {
        this.block(message, 'OK', 'fg=black;bg=green', ' ', true);
    }

    /**
     * @inheritdoc
     */
    error(message) {
        this.block(message, 'ERROR', 'fg=white;bg=red', ' ', true);
    }

    /**
     * @inheritdoc
     */
    warning(message) {
        this.block(message, 'WARNING', 'fg=white;bg=red', ' ', true);
    }

    /**
     * @inheritdoc
     */
    note(message) {
        this.block(message, 'NOTE', 'fg=yellow', ' ! ');
    }

    /**
     * @inheritdoc
     */
    caution(message) {
        this.block(message, 'CAUTION', 'fg=white;bg=red', ' ! ', true);
    }

    /**
     * @inheritdoc
     */
    table(headers, rows) {
        const style = __jymfony.clone(Table.getStyleDefinition('symfony-style-guide'));
        style.cellHeaderFormat = '<info>%s</info>';

        const table = new Table(this);
        table.headers = headers;
        table.rows = rows;
        table.style = style;

        table.render();
        this.newLine();
    }

    /**
     * @inheritdoc
     */
    ask(question, defaultAnswer = undefined, validator = undefined) {
        return (new QuestionBuilder(this._input, this))
            .setPrompt(question)
            .setDefault(defaultAnswer)
            .setValidator(validator)
            .build()
            .ask();
    }

    /**
     * @inheritdoc
     */
    askHidden(question, validator = undefined) {
        return (new QuestionBuilder(this._input, this))
            .setType(QuestionType.PASSWORD)
            .setPrompt(question)
            .setValidator(validator)
            .build()
            .ask();
    }

    /**
     * @inheritdoc
     */
    confirm(question, defaultAnswer = true) {
        return (new QuestionBuilder(this._input, this))
            .setType(QuestionType.CONFIRMATION)
            .setDefault(defaultAnswer)
            .setPrompt(question)
            .build()
            .ask();
    }

    /**
     * @inheritdoc
     */
    choice(question, choices, multiple) {
        return (new QuestionBuilder(this._input, this))
            .setType(QuestionType.CHOICE)
            .setPrompt(question)
            .setChoices(choices)
            .setMultiple(multiple)
            .build()
            .ask();
    }

    /**
     * @inheritdoc
     */
    progressStart(max = undefined, message = '') {
        if (undefined === max) {
            this._progress = new ProgressIndicator(this);
            this._progress.start(message);
        } else {
            this._progress = new ProgressBar(this, max);

            if (! __jymfony.Platform.isWindows()) {
                this._progress.emptyBarCharacter = '░'; // Light shade character \u2591
                this._progress.progressCharacter = '';
                this._progress.barCharacter = '▓'; // Dark shade character \u2593
            }

            this._progress.setMessage(message);
            this._progress.start();
        }
    }

    /**
     * @inheritdoc
     */
    progressAdvance(step = 1, message = undefined) {
        const progress = this._getProgress();

        if (progress instanceof ProgressIndicator) {
            progress.advance();
            if (undefined !== message) {
                progress.message = message;
            }
        } else {
            progress.advance(step);
            if (undefined !== message) {
                progress.setMessage(message);
            }
        }
    }

    /**
     * @inheritdoc
     */
    progressFinish(message = undefined) {
        const progress = this._getProgress();

        if (progress instanceof ProgressIndicator) {
            progress.finish(message || progress.message);
        } else {
            if (undefined !== message) {
                progress.setMessage(message);
            }
            progress.finish();
        }

        this.newLine(2);
        this._progress = undefined;
    }

    /**
     * @inheritdoc
     */
    writeln(messages = '', type = OutputInterface.OUTPUT_NORMAL) {
        super.writeln(messages, type);
        this._bufferedOutput.writeln(this._reduceBuffer(messages), type);
    }

    /**
     * @inheritdoc
     */
    write(messages, newline = false, type = OutputInterface.OUTPUT_NORMAL) {
        super.write(messages, newline, type);
        this._bufferedOutput.write(this._reduceBuffer(messages), newline, type);
    }

    /**
     * @inheritdoc
     */
    newLine(count = 1) {
        super.newLine(count);
        this._bufferedOutput.write('\n'.repeat(count));
    }

    /**
     * Returns a new instance which makes use of stderr if available.
     *
     * @returns self
     */
    getErrorStyle() {
        return new __self(this._input, this._getErrorOutput());
    }

    /**
     * @returns {Jymfony.Component.Console.Helper.ProgressBar|Jymfony.Component.Console.Helper.ProgressIndicator}
     */
    _getProgress() {
        if (undefined === this._progress) {
            throw new RuntimeException('Progress indicator is not started.');
        }

        return this._progress;
    }

    /**
     * @private
     */
    _autoPrependBlock() {
        const chars = this._bufferedOutput.fetch().replace(EOL, '\n').substr(-2);

        if (! chars.charAt(0)) {
            return this.newLine(); // Empty history, so we should start with a new line.
        }

        // Prepend new line for each non LF chars (This means no blank line was output before)
        this.newLine(2 - (chars.split('\n').length - 1));
    }

    /**
     * @private
     */
    _autoPrependText() {
        const fetched = this._bufferedOutput.fetch();

        // Prepend new line if last char isn't EOL:
        if ('\n' !== fetched.substr(-1)) {
            this.newLine();
        }
    }

    /**
     * @param {string[]} messages
     *
     * @private
     */
    _reduceBuffer(messages) {
        // We need to know if the two last chars are PHP_EOL
        // Preserve the last 4 chars inserted (PHP_EOL on windows is two chars) in the history buffer
        return [ this._bufferedOutput.fetch(), ...messages ].map(value => value.substr(-4));
    }

    /**
     * @param {string[]} messages
     * @param {string} [type]
     * @param {undefined|string} style
     * @param {string} [prefix = ' ']
     * @param {boolean} [padding = false]
     * @param {boolean} [escape = false]
     *
     * @private
     */
    _createBlock(messages, type = undefined, style = undefined, prefix = ' ', padding = false, escape = false) {
        let indentLength = 0, lineIndentation;
        const prefixLength = Helper.strlenWithoutDecoration(this.formatter, prefix);
        let lines = [];

        if (undefined !== type) {
            type = '[' + type + '] ';
            indentLength = type.length;
            lineIndentation = ' '.repeat(indentLength);
        }

        // Wrap and add newlines for each element
        for (let [ key, message ] of __jymfony.getEntries(messages)) {
            if (escape) {
                message = OutputFormatter.escape(message);
            }

            lines = [ ...lines, ...__jymfony.wordwrap(message, this._lineLength - prefixLength - indentLength, EOL, true).split(EOL) ];

            if (1 < messages.length && key < messages.length - 1) {
                lines.push('');
            }
        }

        let firstLineIndex = 0;
        if (padding && this.decorated) {
            firstLineIndex = 1;
            lines.unshift('');
            lines.push('');
        }

        for (let [ i, line ] of __jymfony.getEntries(lines)) {
            if (undefined !== type) {
                line = firstLineIndex === i ? type + line : lineIndentation + line;
            }

            line = prefix + line;
            line += ' '.repeat(this._lineLength - Helper.strlenWithoutDecoration(this.formatter, line));

            if (style) {
                line = `<${style}>${line}</>`;
            }

            lines[i] = line;
        }

        return lines;
    }
}

JymfonyStyle.MAX_LINE_LENGTH = 120;

module.exports = JymfonyStyle;
