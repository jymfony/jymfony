declare namespace Jymfony.Component.Logger {
    /**
     * Basic Implementation of LoggerAwareInterface.
     */
    export class LoggerAwareTrait {
        public static readonly definition: Newable<LoggerAwareTrait>;

        /**
         * Sets a logger instance on the object.
         */
        setLogger(logger: LoggerInterface): void;
    }
}
