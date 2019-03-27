declare namespace Jymfony.Component.Logger.Handler {
    /**
     * No-op handler. Handle all records, but does nothing
     */
    export class NoopHandler extends AbstractHandler {
        /**
         * @inheritdoc
         */
        isHandling(): boolean;

        /**
         * @inheritdoc
         */
        handle(): boolean;
    }
}
