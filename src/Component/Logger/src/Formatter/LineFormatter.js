const NormalizerFormatter = Jymfony.Component.Logger.Formatter.NormalizerFormatter;

class LineFormatter extends NormalizerFormatter {
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
     * @inheritDoc
     */
    format(record) {
        const vars = super.format(record);
        let output = this._format;

        for (const [ variable, val ] of __jymfony.getEntries(vars.extra)) {
            output = output.replace(new RegExp(`%extra\.${variable}%`, 'g'), this.stringify(val));
        }

        for (const [ variable, val ] of __jymfony.getEntries(vars.context)) {
            output = output.replace(new RegExp(`%context\.${variable}%`, 'g'), this.stringify(val));
        }

        output = output.replace(/%(context|extra)%/g, '');

        delete vars.context;
        delete vars.extra;

        for (const [ variable, val ] of __jymfony.getEntries(vars)) {
            output = output.replace(new RegExp(`%${variable}%`, 'g'), this.stringify(val));
        }

        // Remove leftover %extra.xxx% and %context.xxx% if any
        output = output.replace(/%(?:extra|context)\..+?%/g, '');

        return output;
    }

    stringify(value) {
        return this._replaceNewlines(this._convertToString(value));
    }

    /**
     * @inheritDoc
     */
    _normalizeError(record) {
        let previousText = '', previous = record;
        while (previous = previous.previous) {
            const trace = Exception.parseStackTrace(previous);
            previousText += ', ' + (new ReflectionClass(previous)).name + ': ' + previous.message + ' at ' + trace[0].file + ':' + trace[0].line;
        }

        const trace = Exception.parseStackTrace(record);
        let str = '[object] (' + (new ReflectionClass(record)).name + ': ' + previous.message + ' at ' + trace[0].file + ':' + trace[0].line + previousText + ')';

        if (this._includeStacktraces) {
            str += '\n[stacktrace]\n' + record.stack + '\n';
        }

        return str;
    }

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
}

LineFormatter.SIMPLE_FORMAT = '[%datetime%] %channel%.%level_name%: %message% %context% %extra%\n';

module.exports = LineFormatter;
