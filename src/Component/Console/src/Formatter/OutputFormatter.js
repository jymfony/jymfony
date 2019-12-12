const InvalidArgumentException = Jymfony.Component.Console.Exception.InvalidArgumentException;
const OutputFormatterInterface = Jymfony.Component.Console.Formatter.OutputFormatterInterface;
const OutputFormatterStyle = Jymfony.Component.Console.Formatter.OutputFormatterStyle;
const OutputFormatterStyleStack = Jymfony.Component.Console.Formatter.OutputFormatterStyleStack;
const ValueHolder = Jymfony.Component.Console.Internal.ValueHolder;

/**
 * @memberOf Jymfony.Component.Console.Formatter
 */
export default class OutputFormatter extends implementationOf(OutputFormatterInterface) {
    /**
     * @param {string} text
     *
     * @returns {string}
     */
    static escape(text) {
        text = text.replace(/([^\\\\]?)</g, '$1\\<');

        return OutputFormatter.escapeTrailingBackslash(text);
    }

    /**
     * @param {string} text
     *
     * @returns {string}
     */
    static escapeTrailingBackslash(text) {
        if ('\\' === text.substr(text.length - 1)) {
            const len = text.length;
            text = __jymfony.rtrim(text, '\\');
            text += '<<'.repeat(len - text.length);
        }

        return text;
    }

    /**
     * Constructor.
     *
     * @param {boolean} [decorated = false]
     * @param {Object<string, Jymfony.Component.Console.Formatter.OutputFormatterStyleStack>} [styles = {}]
     */
    __construct(decorated = false, styles = {}) {
        this._decorated = !! decorated;
        this._styles = {};

        this.setStyle('error', new OutputFormatterStyle('white', 'red'));
        this.setStyle('info', new OutputFormatterStyle('green'));
        this.setStyle('comment', new OutputFormatterStyle('yellow'));
        this.setStyle('question', new OutputFormatterStyle('black', 'cyan'));

        for (const [ name, style ] of __jymfony.getEntries(styles)) {
            this.setStyle(name, style);
        }

        this._styleStack = new OutputFormatterStyleStack();
    }

    /**
     * @inheritdoc
     */
    set decorated(decorated) {
        this._decorated = !! decorated;
    }

    /**
     * @inheritdoc
     */
    get decorated() {
        return this._decorated;
    }

    /**
     * @inheritdoc
     */
    setStyle(name, style) {
        this._styles[name] = style;
    }

    /**
     * @inheritdoc
     */
    hasStyle(name) {
        return !! this._styles[name];
    }

    /**
     * @inheritdoc
     */
    getStyle(name) {
        if (! this.hasStyle(name)) {
            throw new InvalidArgumentException(`Undefined style: ${name}`);
        }

        return this._styles[name];
    }

    /**
     * @inheritdoc
     */
    format(message) {
        return this.formatAndWrap(message, 0);
    }

    /**
     * @inheritdoc
     */
    formatAndWrap(message, width) {
        message = String(message);

        let offset = 0, output = '', match;
        const regex = /<(([a-z][^<>]+)|\/([a-z][^<>]+)?)>/ig;
        const currentLineLength = new ValueHolder(0);

        while ((match = regex.exec(message))) {
            const pos = match.index;
            const text = match[0];

            if (pos && '\\' === message[pos - 1]) {
                continue;
            }

            output += this._applyCurrentStyle(message.substr(offset, pos - offset), output, width, currentLineLength);
            offset = pos + text.length;

            const open = '/' !== text[1];
            const tag = open ? match[1] : match[3];

            let style;
            if (! open && ! tag) {
                // </>
                this._styleStack.pop();
            } else if (false === (style = this._createStyleFromString(tag.toLowerCase()))) {
                output += this._applyCurrentStyle(text, output, width, currentLineLength);
            } else if (open) {
                this._styleStack.push(style);
            } else {
                this._styleStack.pop(style);
            }
        }

        output += this._applyCurrentStyle(message.substr(offset), output, width, currentLineLength);

        if (-1 !== output.indexOf('<<')) {
            return __jymfony.strtr(output, {
                '\\<': '<',
                '<<': '\\',
            });
        }

        return output.replace(/\\</g, '<');
    }

    /**
     * Applies current style from stack to text, if must be applied.
     *
     * @param {string} text Input text
     * @param {string} current
     * @param {int} width
     * @param {Jymfony.Component.Console.Internal.ValueHolder<int>} currentLineLength
     *
     * @returns {string} Styled text.
     *
     * @private
     */
    _applyCurrentStyle(text, current, width, currentLineLength) {
        if ('' === text) {
            return '';
        }

        if (! width) {
            return this._decorated ? this._styleStack.current.apply(text) : text;
        }

        if (! currentLineLength._ && '' !== current) {
            text = __jymfony.ltrim(text);
        }

        let prefix;
        if (currentLineLength._) {
            const i = width - current;
            prefix = text.substr(0, i) + '\n';
            text = text.substr(i);
        } else {
            prefix = '';
        }

        const matches = text.match(/(\n)$/);
        text = prefix + text.replace(new RegExp('([^\\n]{' + width + '})\\ *'), '$1\n');
        text = __jymfony.rtrim(text, '\n') + (matches[1] || '');

        if (! currentLineLength._ && '' !== current && '\n' !== current.substr(current.length - 1)) {
            text = '\n' + text;
        }

        const lines = text.split('\n');

        for (const line of lines) {
            currentLineLength += line.length;
            if (width <= currentLineLength) {
                currentLineLength._ = 0;
            }
        }

        if (this._decorated) {
            for (const [ i, line ] of __jymfony.getEntries(lines)) {
                lines[i] = this._styleStack.current.apply(line);
            }
        }

        return lines.join('\n');
    }

    /**
     * Tries to create new style instance from string.
     *
     * @param {string} string
     *
     * @returns {Jymfony.Component.Console.Formatter.OutputFormatterStyle|boolean} false if string is not format string
     *
     * @private
     */
    _createStyleFromString(string) {
        if (this._styles[string]) {
            return this._styles[string];
        }

        const regexp = /([^=]+)=([^;]+)(;|$)/g;
        let match;
        const style = new OutputFormatterStyle();

        string = string.toLowerCase();
        if (! regexp.test(string)) {
            return false;
        }

        regexp.lastIndex = 0;
        while ((match = regexp.exec(string))) {
            if ('fg' === match[1]) {
                style.foreground = match[2];
            } else if ('bg' === match[1]) {
                style.background = match[2];
            } else if ('href' === match[1]) {
                style.href = match[2];
            } else {
                try {
                    style.setOption(match[2]);
                } catch (e) {
                    return false;
                }
            }
        }

        return style;
    }
}
