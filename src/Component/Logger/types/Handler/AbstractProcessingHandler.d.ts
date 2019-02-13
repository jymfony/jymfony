declare namespace Jymfony.Component.Logger.Handler {
    export abstract class AbstractProcessingHandler extends mix(
        AbstractHandler,
        FormattableHandlerInterface,
        ProcessableHandlerInterface,
        FormattableHandlerTrait,
        ProcessableHandlerTrait
    ) {
        /**
         * @inheritdoc
         */
        handle(record: LogRecord): boolean;

        /**
         * Writes the record down to the log of the implementing handler.
         */
        protected abstract _write(record: LogRecord): void;
    }
}
