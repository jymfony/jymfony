const AbstractHandler = Jymfony.Component.Logger.Handler.AbstractHandler;

/**
 * No-op handler. Handle all records, but does nothing
 *
 * @memberOf Jymfony.Component.Logger.Handler
 */
export default class NoopHandler extends AbstractHandler {
    /**
     * @inheritdoc
     */
    isHandling() {
        return true;
    }

    /**
     * @inheritdoc
     */
    handle() {
        return false;
    }
}
