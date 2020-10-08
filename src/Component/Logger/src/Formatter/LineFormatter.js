const NormalizerFormatter = Jymfony.Component.Logger.Formatter.NormalizerFormatter;

/**
 * @memberOf Jymfony.Component.Logger.Formatter
 */
export default class LineFormatter extends NormalizerFormatter {
    /**
     * Constructor.
     *
     * @param {string} [format]
     * @param {string} [dateFormat]
     * @param {boolean} [allowInlineLineBreaks = false]
     */
    __construct(format = undefined, dateFormat = undefined, allowInlineLineBreaks = false) {
        /**
         * The format for a single record.
         *
         * @type {string}
         *
         * @protected
         */
        this._format = format || this.constructor.SIMPLE_FORMAT;

        /**
         * Whether to replace \n with a line break instead of a space
         *
         * @type {boolean}
         *
         * @protected
         */
        this._allowInlineLineBreaks = allowInlineLineBreaks;

        /**
         * Whether to include stack trace while formatting an Error
         *
         * @type {boolean}
         *
         * @protected
         */
        this._includeStacktraces = false;

        super.__construct(dateFormat);
    }

    /**
     * Sets whether to include stack trace or not while
     * dumping an Error object
     *
     * @param {boolean} include
     */
    set includeStacktrace(include) {
        this._includeStacktraces = !! include;

        if (include) {
            this._allowInlineLineBreaks = true;
        }
    }

    /**
     * @inheritdoc
     */
    format(record) {
        const vars = super.format(record);
        let output = this._format;

        for (const [ variable, val ] of __jymfony.getEntries(vars.extra)) {
            if (isSymbol(variable)) {
                continue;
            }

            output = output.replace(new RegExp(`%extra\.${variable}%`, 'g'), this.stringify(val));
        }

        for (const [ variable, val ] of __jymfony.getEntries(vars.context)) {
            if (isSymbol(variable)) {
                continue;
            }

            output = output.replace(new RegExp(`%context\.${variable}%`, 'g'), this.stringify(val));
        }

        output = output.replace(/%(context|extra)%/g, '');

        delete vars.context;
        delete vars.extra;

        for (const [ variable, val ] of __jymfony.getEntries(vars)) {
            if (isSymbol(variable)) {
                continue;
            }

            output = output.replace(new RegExp(`%${variable}%`, 'g'), this.stringify(val));
        }

        // Remove leftover %extra.xxx% and %context.xxx% if any
        output = output.replace(/%(?:extra|context)\..+?%/g, '');

        return output;
    }

    /**
     * @param {*} value
     *
     * @returns {string}
     */
    stringify(value) {
        return this._replaceNewlines(this._convertToString(value));
    }

    /**
     * @inheritdoc
     */
    _normalizeError(record) {
        const formatError = (error) => {
            const trace = Exception.parseStackTrace(error);
            return (new ReflectionClass(error)).name + ': ' + error.message +
                (null !== trace && 0 < trace.length ? ' at ' + trace[0].file + ':' + trace[0].line : '');
        };

        let previousText = '', previous = record;
        while ((previous = previous.previous)) {
            previousText += ', ' + formatError(previous);
        }

        let str = '[object] (' + formatError(record) + previousText + ')';

        if (this._includeStacktraces) {
            str += '\n[stacktrace]\n' + record.stack + '\n';
        }

        return str;
    }

    /**
     * @param {*} data
     *
     * @returns {string}
     *
     * @private
     */
    _convertToString(data) {
        if (null === data) {
            return 'null';
        }

        if (undefined === data) {
            return 'undefined';
        }

        if (isBoolean(data)) {
            return data ? 'true' : 'false';
        }

        if (isScalar(data)) {
            return '' + data;
        }

        return JSON.stringify(data);
    }

    /**
     * Replaces \r or \n characters.
     *
     * @param {string} str
     *
     * @returns {string}
     *
     * @protected
     */
    _replaceNewlines(str) {
        if (this._allowInlineLineBreaks) {
            if (0 === str.indexOf('{')) {
                return str.replace(/\r/g, '\\r').replace(/\n/g, '\\n');
            }

            return str;
        }

        return str.replace(/(\r\n|\r|\n)/g, ' ');
    }

    static get SIMPLE_FORMAT() {
        return '[%datetime%] %channel%.%level_name%: %message% %context% %extra%\n';
    }
}
