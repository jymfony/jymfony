const AbstractHandler = Jymfony.Component.Logger.Handler.AbstractHandler;

/**
 * No-op handler. Handle all records, but does nothing
 *
 * @memberOf Jymfony.Component.Logger.Handler
 */
class NoopHandler extends AbstractHandler {
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

module.exports = NoopHandler;
