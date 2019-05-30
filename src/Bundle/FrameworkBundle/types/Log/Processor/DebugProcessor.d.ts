declare namespace Jymfony.Bundle.FrameworkBundle.Log.Processor {
    import Command = Jymfony.Component.Console.Command.Command;
    import Request = Jymfony.Component.HttpFoundation.Request;
    import DebugLoggerInterface = Jymfony.Component.Kernel.Log.DebugLoggerInterface;
    import Log = Jymfony.Component.Kernel.Log.Log;
    import LogRecord = Jymfony.Component.Logger.LogRecord;

    export class DebugProcessor extends implementationOf(DebugLoggerInterface) {
        private _records: Map<Request | Command, LogRecord[]>;
        private _errorCount: Map<Request | Command, number>;

        /**
         * Constructor.
         */
        __construct(): void;

        /**
         * Process the log record.
         */
        __invoke(record: LogRecord): LogRecord;

        /**
         * @inheritdoc
         */
        getLogs(subject: Request | Command): Log[];

        /**
         * @inheritdoc
         */
        countErrors(subject: Request | Command): number;

        /**
         * @inheritdoc
         */
        clear(subject?: Request | Command | null): void;
    }
}
