declare namespace Jymfony.Component.Kernel.Log {
    import BaseLogger = Jymfony.Component.Logger.Logger;
    import Command = Jymfony.Component.Console.Command.Command;
    import Request = Jymfony.Component.HttpFoundation.Request;

    abstract class Logger extends mix(BaseLogger, DebugLoggerInterface) {
        /**
         * @inheritdoc
         */
        getLogs(subject: Command | Request): Log[];

        /**
         * @inheritdoc
         */
        countErrors(subject: Command | Request): number;

        /**
         * @inheritdoc
         */
        clear(subject?: Command | Request): void;

        /**
         * Returns a DebugLoggerInterface instance if one is registered with this logger.
         */
        private _getDebugLogger(): DebugLoggerInterface;
    }
}
