declare namespace Jymfony.Component.Logger {
    export class LoggerAwareInterface implements MixinInterface {
        public static readonly definition: Newable<LoggerAwareInterface>;

        /**
         * Sets a logger instance on the object.
         */
        setLogger(logger: LoggerInterface): void;
    }
}
