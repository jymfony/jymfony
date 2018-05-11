const LineFormatter = Jymfony.Component.Logger.Formatter.LineFormatter;
const HandlerInterface = Jymfony.Component.Logger.Handler.HandlerInterface;
const LogLevel = Jymfony.Component.Logger.LogLevel;

/**
 * @memberOf Jymfony.Component.Logger.Handler
 */
class AbstractHandler extends implementationOf(HandlerInterface) {
    /**
     * Constructor.
     *
     * @param {int} [level = LogLevel.DEBUG] The minimum logging level at which this handler will be triggered
     * @param {boolean} [bubble = true] Whether the messages that are handled can bubble up the stack or not
     */
    __construct(level = LogLevel.DEBUG, bubble = true) {
        this._level = level;
        this._bubble = bubble;
    }

    /**
     * @inheritdoc
     */
    close() {
    }

    /**
     * @inheritdoc
     */
    handleBatch(records) {
        for (const record of records) {
            this.handle(record);
        }
    }

    /**
     * @inheritdoc
     */
    isHandling(record) {
        return record.level >= this._level;
    }

    /**
     * Gets the minimum logger level.
     *
     * @returns {int}
     */
    get level() {
        return this._level;
    }

    /**
     * Sets the minimum logger level.
     *
     * @param {int} value
     */
    set level(value) {
        this._level = value;
    }

    /**
     * Gets the bubble flag.
     *
     * @returns {boolean}
     */
    get bubble() {
        return this._bubble;
    }

    /**
     * Sets the bubble flag.
     *
     * @param {boolean} value
     */
    set bubble(value) {
        this._bubble = value;
    }

    /**
     * Gets the default formatter.
     *
     * @returns {Jymfony.Component.Logger.Formatter.FormatterInterface}
     */
    getDefaultFormatter() {
        return new LineFormatter();
    }
}

module.exports = AbstractHandler;
