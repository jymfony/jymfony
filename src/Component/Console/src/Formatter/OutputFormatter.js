const InvalidArgumentException = Jymfony.Console.Exception.InvalidArgumentException;
const OutputFormatterInterface = Jymfony.Console.Formatter.OutputFormatterInterface;
const OutputFormatterStyle = Jymfony.Console.Formatter.OutputFormatterStyle;
const OutputFormatterStyleStack = Jymfony.Console.Formatter.OutputFormatterStyleStack;

/**
 * @memberOf Jymfony.Console.Formatter
 * @type OutputFormatter
 */
module.exports = class OutputFormatter extends implementationOf(OutputFormatterInterface) {
    static escape(text) {
        text = text.replace(/([^\\\\]?)</g, '$1\\<');

        if ('\\' === text.substr(text.length - 1)) {
            let len = text.length;
            text = __jymfony.rtrim(text, '\\');
            text += '<<'.repeat(len - text.length);
        }

        return text;
    }

    constructor(decorated = false, styles = {}) {
        super();
        this._decorated = !! decorated;
        this._styles = {};

        this.setStyle('error', new OutputFormatterStyle('white', 'red'));
        this.setStyle('info', new OutputFormatterStyle('green'));
        this.setStyle('comment', new OutputFormatterStyle('yellow'));
        this.setStyle('question', new OutputFormatterStyle('black', 'cyan'));

        for (let [ name, style ] of __jymfony.getEntries(styles)) {
            this.setStyle(name, style);
        }

        this._styleStack = new OutputFormatterStyleStack();
    }

    /**
     * @inheritDoc
     */
    set decorated(decorated) {
        this._decorated = !! decorated;
    }

    /**
     * @inheritDoc
     */
    get decorated() {
        return this._decorated;
    }

    /**
     * @inheritDoc
     */
    setStyle(name, style) {
        this._styles[name] = style;
    }

    /**
     * @inheritDoc
     */
    hasStyle(name) {
        return !! this._styles[name];
    }

    /**
     * @inheritDoc
     */
    getStyle(name) {
        if (! this.hasStyle(name)) {
            throw new InvalidArgumentException(`Undefined style: ${name}`);
        }

        return this._styles[name];
    }

    /**
     * @inheritDoc
     */
    format(message) {
        message = message.toString();
        let offset = 0, output = '', match;
        let regex = /<(([a-z][a-z0-9_=;-]+)|\/([a-z][a-z0-9_=;-]+)?)>/ig;

        while (match = regex.exec(message)) {
            let pos = match.index;
            let text = match[0];

            if (pos && '\\' == message[pos - 1]) {
                continue;
            }

            output += this._applyCurrentStyle(message.substr(offset, pos - offset));
            offset = pos + text.length;

            let open = '/' != text[1];
            let tag = open ? match[1] : match[3];

            let style;
            if (! open && ! tag) {
                // </>
                this._styleStack.pop();
            } else if (false === (style = this._createStyleFromString(tag.toLowerCase()))) {
                output += this._applyCurrentStyle(text);
            } else if (open) {
                this._styleStack.push(style);
            } else {
                this._styleStack.pop(style);
            }
        }

        output += this._applyCurrentStyle(message.substr(offset));

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
     *
     * @returns {string} Styled text
     *
     * @private
     */
    _applyCurrentStyle(text) {
        return this.decorated && 0 < text.length ? this._styleStack.current.apply(text) : text;
    }

    /**
     * Tries to create new style instance from string.
     *
     * @param {string} string
     *
     * @returns {Jymfony.Console.Formatter.OutputFormatterStyle|boolean} false if string is not format string
     *
     * @private
     */
    _createStyleFromString(string) {
        if (this._styles[string]) {
            return this._styles[string];
        }

        let regexp = /([^=]+)=([^;]+)(;|$)/g, match;
        let style = new OutputFormatterStyle();

        string = string.toLowerCase();
        if (! regexp.test(string)) {
            return false;
        }

        regexp.lastIndex = 0;
        while (match = regexp.exec(string)) {
            if ('fg' == match[1]) {
                style.foreground = match[2];
            } else if ('bg' == match[1]) {
                style.background = match[2];
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
};
