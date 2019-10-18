declare namespace Jymfony.Component.Kernel.Log {
    import BaseLogger = Jymfony.Component.Logger.Logger;
    import Command = Jymfony.Component.Console.Command.Command;
    import Request = Jymfony.Component.HttpFoundation.Request;
    import FinishRequestEvent = Jymfony.Contracts.HttpServer.Event.FinishRequestEvent;
    import EventSubscriptions = Jymfony.Contracts.EventDispatcher.EventSubscriptions;

    export abstract class Logger extends mix(BaseLogger, DebugLoggerInterface) {
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
         * Called on http server request finish.
         */
        onFinishHttpRequest(event: FinishRequestEvent): void;

        /**
         * @inheritdoc
         */
        static getSubscribedEvents(): EventSubscriptions;

        /**
         * Returns a DebugLoggerInterface instance if one is registered with this logger.
         */
        private _getDebugLogger(): DebugLoggerInterface;
    }
}
