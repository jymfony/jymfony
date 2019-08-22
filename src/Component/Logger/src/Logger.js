const DateTime = Jymfony.Component.DateTime.DateTime;
const EventSubscriberInterface = Jymfony.Contracts.EventDispatcher.EventSubscriberInterface;
const AbstractLogger = Jymfony.Component.Logger.AbstractLogger;
const LogicException = Jymfony.Component.Logger.Exception.LogicException;
const LogLevel = Jymfony.Component.Logger.LogLevel;

/**
 * @memberOf Jymfony.Component.Logger
 */
export default class Logger extends mix(AbstractLogger, EventSubscriberInterface, __jymfony.ClsTrait) {
    /**
     * Construct the logger
     *
     * @param {string} name
     * @param {Jymfony.Component.Logger.Handler.HandlerInterface[]} [handlers = []]
     * @param {Function[]} [processors = []]
     * @param {undefined|string|Jymfony.Component.DateTime.DateTimeZone} [timezone]
     */
    __construct(name, handlers = [], processors = [], timezone = undefined) {
        /**
         * @type {string}
         *
         * @protected
         */
        this._name = name;

        /**
         * @type {Jymfony.Component.Logger.Handler.HandlerInterface[]}
         *
         * @protected
         */
        this._handlers = handlers;

        /**
         * @type {Function[]}
         *
         * @protected
         */
        this._processors = processors;

        /**
         * @type {undefined|string|Jymfony.Component.DateTime.DateTimeZone}
         *
         * @protected
         */
        this._timezone = timezone;
    }

    /**
     * Get the logger name.
     *
     * @returns {string}
     */
    get name() {
        return this._name;
    }

    /**
     * Returns a new cloned instance with name changed.
     *
     * @param {string} name
     *
     * @returns {Jymfony.Component.Logger.Logger}
     */
    withName(name) {
        return new Logger(name, [ ...this._handlers ], [ ...this._processors ], this._timezone);
    }

    /**
     * Pushes an handler onto the stack.
     *
     * @param {Jymfony.Component.Logger.Handler.HandlerInterface} handler
     *
     * @returns {Jymfony.Component.Logger.Logger}
     */
    pushHandler(handler) {
        this._handlers.unshift(handler);
        return this;
    }

    /**
     * Pops out an handler off the stack.
     *
     * @returns {Jymfony.Component.Logger.Handler.HandlerInterface}
     *
     * @throws {Jymfony.Component.Logger.Exception.LogicException}
     */
    popHandler() {
        if (! this._handlers.length) {
            throw new LogicException('You tried to pop an handler out of an empty stack');
        }

        return this._handlers.shift();
    }

    /**
     * Set handlers.
     *
     * @param {Jymfony.Component.Logger.Handler.HandlerInterface[]} handlers
     */
    set handlers(handlers) {
        this._handlers = [];

        if (! isArray(handlers)) {
            handlers = Object.values(handlers);
        }

        for (const handler of handlers.reverse()) {
            this.pushHandler(handler);
        }
    }

    /**
     * Get all handlers.
     *
     * @returns {Jymfony.Component.Logger.Handler.HandlerInterface[]}
     */
    get handlers() {
        return [ ...this._handlers ];
    }

    /**
     * Push a logger processor.
     *
     * @param {Function} processor
     *
     * @returns {Jymfony.Component.Logger.Logger}
     */
    pushProcessor(processor) {
        if (! isFunction(processor)) {
            throw new InvalidArgumentException('Processors must be valid callables.');
        }

        this._processors.unshift(processor);
        return this;
    }

    /**
     * Pops out a processor off the stack.
     *
     * @returns {Function}
     *
     * @throws {Jymfony.Component.Logger.Exception.LogicException}
     */
    popProcessor() {
        if (! this._processors.length) {
            throw new LogicException('You tried to pop a processor out of an empty stack');
        }

        return this._processors.shift();
    }

    /**
     * Gets the processor array.
     *
     * @returns {Function[]}
     */
    get processors() {
        return [ ...this._processors ];
    }

    /**
     * Adds a record to the log.
     *
     * @param {int} level
     * @param {string} message
     * @param {Object.<*>} [context = {}]
     *
     * @returns {boolean}
     */
    addRecord(level, message, context = {}) {
        /** @var {string} levelName */
        const levelName = __self.levels[level];

        const it = __jymfony.getEntries(this._handlers);
        let handlerKey, handler, current;
        while (current = it.next(), ! current.done) {
            handler = current.value[1];
            if (handler.isHandling({ level: level })) {
                handlerKey = current.value[0];
                break;
            }
        }

        if (undefined === handlerKey) {
            return false;
        }

        let record = {
            message: message,
            context: Object.assign({}, this._activeContext, context),
            level: level,
            level_name: levelName,
            channel: this._name,
            datetime: new DateTime(undefined, this._timezone),
            extra: {},
        };

        for (const processor of this._processors) {
            record = processor(record);
        }

        do {
            handler = current.value[1];
            if (true === handler.handle(record)) {
                break;
            }
        } while (current = it.next(), ! current.done);

        return true;
    }

    /**
     * Adds a log record at the DEBUG level.
     *
     * @param {string} message
     * @param {Object.<*>} [context = {}]
     *
     * @returns {boolean}
     */
    addDebug(message, context = {}) {
        return this.addRecord(LogLevel.DEBUG, message, context);
    }

    /**
     * Adds a log record at the INFO level.
     *
     * @param {string} message
     * @param {Object.<*>} [context = {}]
     *
     * @returns {boolean}
     */
    addInfo(message, context = {}) {
        return this.addRecord(LogLevel.INFO, message, context);
    }

    /**
     * Adds a log record at the NOTICE level.
     *
     * @param {string} message
     * @param {Object.<*>} [context = {}]
     *
     * @returns {boolean}
     */
    addNotice(message, context = {}) {
        return this.addRecord(LogLevel.NOTICE, message, context);
    }

    /**
     * Adds a log record at the WARNING level.
     *
     * @param {string} message
     * @param {Object.<*>} [context = {}]
     *
     * @returns {boolean}
     */
    addWarning(message, context = {}) {
        return this.addRecord(LogLevel.WARNING, message, context);
    }

    /**
     * Adds a log record at the ERROR level.
     *
     * @param {string} message
     * @param {Object.<*>} [context = {}]
     *
     * @returns {boolean}
     */
    addError(message, context = {}) {
        return this.addRecord(LogLevel.ERROR, message, context);
    }

    /**
     * Adds a log record at the CRITICAL level.
     *
     * @param {string} message
     * @param {Object.<*>} [context = {}]
     *
     * @returns {boolean}
     */
    addCritical(message, context = {}) {
        return this.addRecord(LogLevel.CRITICAL, message, context);
    }

    /**
     * Adds a log record at the ALERT level.
     *
     * @param {string} message
     * @param {Object.<*>} [context = {}]
     *
     * @returns {boolean}
     */
    addAlert(message, context = {}) {
        return this.addRecord(LogLevel.ALERT, message, context);
    }

    /**
     * Adds a log record at the EMERGENCY level.
     *
     * @param {string} message
     * @param {Object.<*>} [context = {}]
     *
     * @returns {boolean}
     */
    addEmergency(message, context = {}) {
        return this.addRecord(LogLevel.EMERGENCY, message, context);
    }

    /**
     * Checks if there's a handler that listen on level
     *
     * @param {int} level
     */
    isHandling(level) {
        const record = { level: level };
        const it = __jymfony.getEntries(this._handlers);
        let handler;

        while ((handler = it.value[1])) {
            if (handler.isHandling(record)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Adds a record to the log
     *
     * @param {int} level
     * @param {string} message
     * @param {Object.<*>} [context = {}]
     */
    log(level, message, context = {}) {
        this.addRecord(level, message.toString(), context);
    }

    /**
     * @inheritdoc
     */
    static getSubscribedEvents() {
        return {
            'console.command': [ '_onConsoleCommand', 1024 ],
            'console.terminate': [ '_onConsoleTerminate', -1024 ],
            'http.request': [ '_onHttpRequest', 1024 ],
            'http.finish_request': [ '_onHttpFinishRequest', -1024 ],
        };
    }
}

Logger.levels = {
    [LogLevel.DEBUG]: 'DEBUG',
    [LogLevel.INFO]: 'INFO',
    [LogLevel.NOTICE]: 'NOTICE',
    [LogLevel.WARNING]: 'WARNING',
    [LogLevel.ERROR]: 'ERROR',
    [LogLevel.CRITICAL]: 'CRITICAL',
    [LogLevel.ALERT]: 'ALERT',
    [LogLevel.EMERGENCY]: 'EMERGENCY',
};
