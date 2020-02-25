const AbstractLogger = Jymfony.Component.Logger.AbstractLogger;
const DateTime = Jymfony.Component.DateTime.DateTime;
const LogLevel = Jymfony.Component.Logger.LogLevel;

const levels = {
    [LogLevel.DEBUG]: 'Debug',
    [LogLevel.INFO]: 'Info',
    [LogLevel.NOTICE]: 'Notice',
    [LogLevel.WARNING]: 'Warning',
    [LogLevel.ERROR]: 'Error',
    [LogLevel.CRITICAL]: 'Critical',
    [LogLevel.ALERT]: 'Alert',
    [LogLevel.EMERGENCY]: 'Emergency',
};

/**
 * A buffering logger that stacks logs for later.
 *
 * @memberOf Jymfony.Component.Debug
 */
export default class BufferingLogger extends AbstractLogger {
    __construct() {
        /**
         * @type {[string, string, object]}
         *
         * @private
         */
        this._logs = [];
    }

    /**
     * @inheritdoc
     */
    log(level, message, context = {}) {
        this._logs.push([ level, message, context ]);
    }

    cleanLogs() {
        const logs = this._logs;
        this._logs = [];

        return logs;
    }

    finalize() {
        for (const [ level, message, context ] of this._logs) {
            let formattedMessage = message;
            if (message.includes('{')) {
                for (const [ key, val ] of __jymfony.getEntries(context)) {
                    const regex = new RegExp('\\{' + key + '\\}', 'g');
                    if (null === val || undefined === val || isScalar(val)) {
                        formattedMessage = formattedMessage.replace(regex, String(val));
                    } else if (val instanceof Date) {
                        formattedMessage = formattedMessage.replace(regex, new DateTime(val).format(DateTime.RFC3339));
                    } else if (val instanceof DateTime) {
                        formattedMessage = formattedMessage.replace(regex, val.format(DateTime.RFC3339));
                    } else if (isObject(val)) {
                        formattedMessage = formattedMessage.replace(regex, val.toString());
                    } else {
                        formattedMessage = formattedMessage.replace(regex, '[' + typeof val + ']');
                    }
                }
            }

            process.stderr.write(__jymfony.sprintf('%s [%s] %s', new DateTime().format(DateTime.RFC3339), levels[level], message));
        }

        if (0 < this._logs.length) {
            process.stderr.write('\n\n');
        }
    }
}
