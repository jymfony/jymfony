const DebugLoggerInterface = Jymfony.Component.Kernel.Log.DebugLoggerInterface;
const LogLevel = Jymfony.Component.Logger.LogLevel;
const ClsTrait = __jymfony.ClsTrait;

/**
 * @memberOf Jymfony.Bundle.FrameworkBundle.Log.Processor
 */
class DebugProcessor extends implementationOf(DebugLoggerInterface) {
    /**
     * Constructor.
     */
    __construct() {
        /**
         * @type {Map<Jymfony.Component.HttpFoundation.Request|Jymfony.Component.Console.Command, Jymfony.Component.Logger.LogRecord[]>}
         *
         * @private
         */
        this._records = new Map();

        /**
         * @type {Map<Jymfony.Component.HttpFoundation.Request|Jymfony.Component.Console.Command, int>}
         *
         * @private
         */
        this._errorCount = new Map();
    }

    /**
     * Process the log record.
     *
     * @param {Jymfony.Component.Logger.LogRecord} record
     *
     * @returns {Jymfony.Component.Logger.LogRecord}
     */
    __invoke(record) {
        const subject = record.context[ClsTrait.REQUEST_SYMBOL] || record.context[ClsTrait.COMMAND_SYMBOL];
        if (! subject) {
            return record;
        }

        if (! this._records.has(subject)) {
            this._records.set(subject, []);
            this._errorCount.set(subject, 0);
        }

        this._records.get(subject).push({
            timestamp: record.datetime.timestamp,
            message: record.message,
            priority: record.level,
            priorityName: record.level_name,
            context: record.context,
            channel: record.channel || '',
        });

        if (record.level >= LogLevel.ERROR) {
            this._errorCount.set(subject, this._errorCount.get(subject) + 1);
        }

        return record;
    }

    /**
     * @inheritdoc
     */
    getLogs(subject) {
        return this._records.has(subject) ? [ ...this._records.get(subject) ] : [];
    }

    /**
     * @inheritdoc
     */
    countErrors(subject) {
        return this._errorCount.has(subject) ? this._errorCount.get(subject) : 0;
    }

    /**
     * @inheritdoc
     */
    clear(subject = null) {
        if (subject) {
            this._records.delete(subject);
            this._errorCount.delete(subject);
        } else {
            this._records = new Map();
            this._errorCount = new Map();
        }
    }
}

module.exports = DebugProcessor;
