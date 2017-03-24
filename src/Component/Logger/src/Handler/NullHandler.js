const AbstractHandler = Jymfony.Component.Logger.Handler.AbstractHandler;

/**
 * Blackhole
 *
 * @memberOf Jymfony.Component.Logger.Handler
 */
class NullHandler extends AbstractHandler {
    /**
     * @inheritDoc
     */
    handle(record) {
        return this.isHandling(record);
    }
}

module.exports = NullHandler;
