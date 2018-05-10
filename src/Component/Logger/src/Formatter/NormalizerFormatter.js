const DateTime = Jymfony.Component.DateTime.DateTime;
const FormatterInterface = Jymfony.Component.Logger.Formatter.FormatterInterface;

/**
 * @memberOf Jymfony.Component.Logger.Formatter
 */
class NormalizerFormatter extends implementationOf(FormatterInterface) {
    /**
     * Constructor.
     *
     * @param {string} [dateFormat]
     */
    __construct(dateFormat = undefined) {
        /**
         * The date format.
         *
         * @type {string}
         *
         * @protected
         */
        this._dateFormat = dateFormat || this.constructor.SIMPLE_DATE;
    }

    /**
     * @inheritdoc
     */
    format(record) {
        return this._normalize(record);
    }

    /**
     * @inheritdoc
     */
    formatBatch(records) {
        records = __jymfony.deepClone(records);
        for (const [ key, entry ] of __jymfony.getEntries(records)) {
            records[key] = this.format(entry);
        }

        return records;
    }

    /**
     * Normalizes a log record
     *
     * @param {*} record
     * @param {int} depth
     *
     * @protected
     */
    _normalize(record, depth = 0) {
        if (9 < depth) {
            return 'Over 9 levels deep. Aborting normalization...';
        }

        if (undefined === record) {
            return 'undefined';
        }

        if (null === record) {
            return 'null';
        }

        if (isScalar(record)) {
            if (isNumber(record) && ! Number.isFinite(record)) {
                return (0 < record ? '' : '-') + 'Infinity';
            }

            return record.toString();
        }

        if (isArray(record)) {
            return record.map(v => this._normalize(v, depth + 1));
        }

        if (isObjectLiteral(record)) {
            const normalized = {};
            let count = 0;
            for (const [ key, value ] of __jymfony.getEntries(record)) {
                if (1000 < ++count) {
                    normalized['...'] = 'Over 1000 entries. Aborting normalization...';
                    break;
                }

                normalized[key] = this._normalize(value, depth + 1);
            }

            return normalized;
        }

        if (record instanceof Date) {
            record = new DateTime(record);
        }

        if (record instanceof DateTime) {
            return this._formatDate(record);
        }

        if (isObject(record)) {
            if (record instanceof Error) {
                return this._normalizeError(record, depth);
            }

            const reflClass = new ReflectionClass(record);
            let value;
            if (reflClass.hasMethod('toString')) {
                value = record.toString();
            } else {
                const encoded = JSON.stringify(record);
                value = JSON.parse(encoded);
            }

            return { [reflClass.name]: value };
        }

        return Object.prototype.toString.call(record);
    }

    /**
     * Normalizes an Error object.
     *
     * @param {Error} record
     * @param {int} depth
     *
     * @protected
     */
    _normalizeError(record, depth) {
        const trace = Exception.parseStackTrace(record);
        const reflClass = new ReflectionClass(trace);

        const data = {
            'class': reflClass.name,
            message: record.message,
            trace: trace,
        };

        const previous = record.previous;
        if (previous) {
            data.previous = this._normalize(previous, depth + 1);
        }

        return data;
    }

    /**
     * Formats a datetime object
     *
     * @param {Jymfony.Component.DateTime.DateTime} record
     *
     * @protected
     */
    _formatDate(record) {
        return record.format(this._dateFormat);
    }
}

NormalizerFormatter.SIMPLE_DATE = 'Y-m-d\\TH:i:sP';

module.exports = NormalizerFormatter;
