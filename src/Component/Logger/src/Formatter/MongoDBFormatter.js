const DateTime = Jymfony.Component.DateTime.DateTime;
const FormatterInterface = Jymfony.Component.Logger.Formatter.FormatterInterface;
const BSON = require('bson');

/**
 * @memberOf Jymfony.Component.Logger.Formatter
 */
class MongoDBFormatter extends implementationOf(FormatterInterface) {
    /**
     * Constructor.
     *
     * @param {int} [maxNestingLevel = 3] means infinite nesting, the record itself is level 1,
     *                                    record.context is 2
     * @param {boolean} exceptionTraceAsString set to false to log exception traces as a sub documents
     *                                         instead of strings
     */
    __construct(maxNestingLevel = 3, exceptionTraceAsString = true) {
        this._maxNestingLevel = Math.max(maxNestingLevel, 0);
        this._exceptionTraceAsString = exceptionTraceAsString;
    }

    /**
     * @inheritdoc
     */
    format(record) {
        return this._formatArray(record);
    }

    /**
     * @inheritdoc
     */
    formatBatch(records) {
        records = __jymfony.deepClone(records);
        for (const [ key, record ] of __jymfony.getEntries(records)) {
            records[key] = this.format(record);
        }

        return records;
    }

    /**
     * Treat and format the given record as an array.
     *
     * @param {*} record
     * @param {int} nestingLevel
     *
     * @return {[]|string} Array except when max nesting level is reached then a string "[...]"
     *
     * @protected
     */
    _formatArray(record, nestingLevel = 0) {
        if (0 === this._maxNestingLevel || nestingLevel <= this._maxNestingLevel) {
            record = __jymfony.deepClone(record);
            for (const [ name, value ] of __jymfony.getEntries(record)) {
                if (value instanceof Date) {
                    record[name] = this._formatDate(new DateTime(value), nestingLevel + 1);
                } else if (value instanceof DateTime) {
                    record[name] = this._formatDate(value, nestingLevel + 1);
                } else if (value instanceof Error) {
                    record[name] = this._formatError(value, nestingLevel + 1);
                } else if (isArray(value) || isObjectLiteral(value)) {
                    record[name] = this._formatArray(value, nestingLevel + 1);
                } else if (isObject(value)) {
                    record[name] = this._formatObject(value, nestingLevel + 1);
                }
            }
        } else {
            record = '[...]';
        }

        return record;
    }

    /**
     * Treat and format the given record as an object.
     *
     * @param {*} record
     * @param {int} nestingLevel
     *
     * @protected
     */
    _formatObject(record, nestingLevel) {
        const reflClass = new ReflectionClass(record);
        const value = reflClass.hasMethod('toString') ?
            record.toString() : JSON.parse(JSON.stringify(record));

        return this._formatArray({[reflClass.name]: value}, nestingLevel);
    }

    /**
     * Treat and format the given record as an error.
     *
     * @param {Error} record
     * @param {int} nestingLevel
     *
     * @protected
     */
    _formatError(record, nestingLevel) {
        const trace = Exception.parseStackTrace(record);
        const reflClass = new ReflectionClass(trace);

        const formatted = {
            'class': reflClass.name,
            message: record.message,
            trace: this._exceptionTraceAsString ? record.stack : trace,
        };

        return this._formatArray(formatted, nestingLevel);
    }

    /**
     * Treat and format the given record as a date.
     *
     * @param {DateTime} record
     *
     * @protected
     */
    _formatDate(record) {
        return BSON.Timestamp.fromInt(record.microtime);
    }

}

module.exports = MongoDBFormatter;
