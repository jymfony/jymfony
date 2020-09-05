const AbstractLogger = Jymfony.Component.Logger.AbstractLogger;
const DateTime = Jymfony.Component.DateTime.DateTime;
const DateTimeInterface = Jymfony.Contracts.DateTime.DateTimeInterface;
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
    /**
     * Constructor.
     *
     * @param {WriteStream} stream
     */
    __construct(stream = process.stderr) {
        /**
         * @type {[string, string, object][]}
         *
         * @private
         */
        this._logs = [];

        /**
         * @type {WriteStream}
         *
         * @private
         */
        this._stream = stream;
    }

    /**
     * @inheritdoc
     */
    log(level, message, context = {}) {
        this._logs.push([ level, message, context ]);
    }

    /**
     * Cleans and returns the buffered logs.
     *
     * @returns {[string, string, object][]}
     */
    cleanLogs() {
        const logs = this._logs;
        this._logs = [];

        return logs;
    }

    /**
     * Print out all the buffered logs.
     */
    finalize() {
        let lastMessage = undefined;
        let count = 1;

        const out = () => {
            if (undefined === lastMessage) {
                return;
            }

            this._stream.write(lastMessage);
            if (1 < count) {
                this._stream.write(__jymfony.sprintf(' (repeated %u times)', count));
            }

            this._stream.write('\n');
            count = 1;
        };

        for (const [ level, message, context ] of this._logs) {
            let formattedMessage = message;
            if (message.includes('{')) {
                for (const [ key, val ] of __jymfony.getEntries(context)) {
                    const regex = new RegExp('\\{' + key + '\\}', 'g');
                    if (null === val || undefined === val || isScalar(val)) {
                        formattedMessage = formattedMessage.replace(regex, String(val));
                    } else if (val instanceof Date) {
                        formattedMessage = formattedMessage.replace(regex, new DateTime(val).format(DateTimeInterface.RFC3339));
                    } else if (val instanceof DateTimeInterface) {
                        formattedMessage = formattedMessage.replace(regex, val.format(DateTimeInterface.RFC3339));
                    } else if (isObject(val)) {
                        formattedMessage = formattedMessage.replace(regex, val.toString());
                    } else {
                        formattedMessage = formattedMessage.replace(regex, '[' + typeof val + ']');
                    }
                }
            }

            const log = __jymfony.sprintf('[%s] %s', levels[level], message);
            if (lastMessage !== log) {
                out();
                lastMessage = log;
            } else {
                count++;
            }
        }

        out();
        if (0 < this._logs.length) {
            this._stream.write('\n');
        }
    }
}
