declare namespace Jymfony.Component.Logger {
    import DateTimeZone = Jymfony.Component.DateTime.DateTimeZone;
    import HandlerInterface = Jymfony.Component.Logger.Handler.HandlerInterface;
    import EventSubscriberInterface = Jymfony.Contracts.EventDispatcher.EventSubscriberInterface;
    import EventSubscriptions = Jymfony.Contracts.EventDispatcher.EventSubscriptions;

    type InvokableProcessor = (record: LogRecord) => LogRecord | {
        __invoke(record: LogRecord): LogRecord;
    };

    export class Logger extends mix(AbstractLogger, EventSubscriberInterface, __jymfony.ClsTrait) {
        public static readonly levels: Record<LogLevel, string>;

        public readonly name: string;
        public handlers: HandlerInterface[];
        public readonly processors: InvokableProcessor[];

        protected _name: string;
        protected _handlers: HandlerInterface[];
        protected _processors: InvokableProcessor[];
        protected _timezone: DateTimeZone | undefined;

        /**
         * Construct the logger.
         */
        __construct(name: string, handlers?: HandlerInterface[], processors?: InvokableProcessor[], timezone?: DateTimeZone): void;
        constructor(name: string, handlers?: HandlerInterface[], processors?: InvokableProcessor[], timezone?: DateTimeZone);

        /**
         * Returns a new cloned instance with name changed.
         */
        withName(name: string): Logger;

        /**
         * Pushes an handler onto the stack.
         */
        pushHandler(handler: HandlerInterface): Logger;

        /**
         * Pops out an handler off the stack.
         *
         * @throws {Jymfony.Component.Logger.Exception.LogicException}
         */
        popHandler(): HandlerInterface;

        /**
         * Push a logger processor.
         */
        pushProcessor(processor: InvokableProcessor): Logger;

        /**
         * Pops out a processor off the stack.
         *
         * @throws {Jymfony.Component.Logger.Exception.LogicException}
         */
        popProcessor(): InvokableProcessor

        /**
         * Adds a record to the log.
         */
        addRecord(level: number, message: string, context: Record<string, any>): boolean;

        /**
         * Adds a log record at the DEBUG level.
         */
        addDebug(message: string, context: Record<string, any>): boolean;

        /**
         * Adds a log record at the INFO level.
         */
        addInfo(message: string, context: Record<string, any>): boolean;

        /**
         * Adds a log record at the NOTICE level.
         */
        addNotice(message: string, context: Record<string, any>): boolean;

        /**
         * Adds a log record at the WARNING level.
         */
        addWarning(message: string, context: Record<string, any>): boolean;

        /**
         * Adds a log record at the ERROR level.
         */
        addError(message: string, context: Record<string, any>): boolean;

        /**
         * Adds a log record at the CRITICAL level.
         */
        addCritical(message: string, context: Record<string, any>): boolean;

        /**
         * Adds a log record at the ALERT level.
         */
        addAlert(message: string, context: Record<string, any>): boolean;

        /**
         * Adds a log record at the EMERGENCY level.
         */
        addEmergency(message: string, context: Record<string, any>): boolean;

        /**
         * Checks if there's a handler that listen on level
         */
        isHandling(level: number): boolean;

        /**
         * Adds a record to the log.
         */
        log(level: number, message: string, context: Record<string, any>): void;

        /**
         * @inheritdoc
         */
        static getSubscribedEvents(): EventSubscriptions;
    }
}
