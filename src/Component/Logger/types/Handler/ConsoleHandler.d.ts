declare namespace Jymfony.Component.Logger.Handler {
    import ConsoleCommandEvent = Jymfony.Component.Console.Event.ConsoleCommandEvent;
    import OutputInterface = Jymfony.Component.Console.Output.OutputInterface;
    import EventSubscriberInterface = Jymfony.Component.EventDispatcher.EventSubscriberInterface;
    import EventSubscriptions = Jymfony.Component.EventDispatcher.EventSubscriptions;
    import FormatterInterface = Jymfony.Component.Logger.Formatter.FormatterInterface;

    export class ConsoleHandler extends mix(AbstractProcessingHandler, EventSubscriberInterface) {
        private _output: OutputInterface;
        private _verbosityLevelMap: Record<number, number>;
        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(output?: OutputInterface, bubble?: boolean, verbosityLevelMap?: Record<number, number>): void;
        constructor(output?: OutputInterface, bubble?: boolean, verbosityLevelMap?: Record<number, number>);

        /**
         * @inheritdoc
         */
        isHandling(record: LogRecord): boolean;

        /**
         * @inheritdoc
         */
        handle(record: LogRecord): boolean;

        /**
         * Disables the output.
         */
        close(): void;

        /**
         * Before a command is executed, the handler gets activated and the console output
         * is set in order to know where to write the logs.
         *
         * @param {Jymfony.Component.Console.Event.ConsoleCommandEvent} event
         */
        onCommand(event: ConsoleCommandEvent): void;

        /**
         * After a command has been executed, it disables the output.
         */
        onTerminate(): void;

        /**
         * @inheritdoc
         */
        static getSubscribedEvents(): EventSubscriptions;

        /**
         * @inheritdoc
         */
        getDefaultFormatter(): FormatterInterface;

        /**
         * @inheritdoc
         */
        protected _write(record: LogRecord): void;

        /**
         * Updates the logging level based on the verbosity setting of the console output.
         *
         * @returns Whether the handler is enabled and verbosity is not set to quiet.
         */
        private _updateLevel(): boolean;
    }
}
