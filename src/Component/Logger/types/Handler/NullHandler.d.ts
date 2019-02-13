declare namespace Jymfony.Component.Logger.Handler {
    /**
     * Blackhole.
     */
    export class NullHandler extends AbstractHandler {
        /**
         * @inheritdoc
         */
        handle(record: LogRecord): boolean;
    }
}
