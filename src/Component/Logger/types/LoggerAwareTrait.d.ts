declare namespace Jymfony.Component.Logger {
    /**
     * Basic Implementation of LoggerAwareInterface.
     */
    export class LoggerAwareTrait implements MixinInterface {
        public static readonly definition: Newable<LoggerAwareTrait>;

        /**
         * Sets a logger instance on the object.
         */
        setLogger(logger: LoggerInterface): void;
    }
}
