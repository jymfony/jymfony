declare namespace Jymfony.Component.Debug {
    import AbstractLogger = Jymfony.Component.Logger.AbstractLogger;

    /**
     * A buffering logger that stacks logs for later.
     */
    export class BufferingLogger extends AbstractLogger {
        private _logs: [string, string, object][];

        __construct(): void;
        constructor();

        /**
         * @inheritdoc
         */
        log(level: number, message: string, context?: Record<string, any>): void;

        cleanLogs(): void;
        finalize(): void;
    }
}
