const AbstractHandler = Jymfony.Component.Logger.Handler.AbstractHandler;

/**
 * No-op handler. Handle all records, but does nothing
 *
 * @memberOf Jymfony.Component.Logger.Handler
 */
class NoopHandler extends AbstractHandler {
    /**
     * @inheritDoc
     */
    isHandling() {
        return true;
    }

    /**
     * @inheritDoc
     */
    handle() {
        return false;
    }
}

module.exports = NoopHandler;
