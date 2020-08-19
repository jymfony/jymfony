declare namespace Jymfony.Component.Logger {
    export class LoggerAwareInterface {
        public static readonly definition: Newable<LoggerAwareInterface>;

        /**
         * Sets a logger instance on the object.
         */
        setLogger(logger: LoggerInterface): void;
    }
}
