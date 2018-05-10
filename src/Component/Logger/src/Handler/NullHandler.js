const AbstractHandler = Jymfony.Component.Logger.Handler.AbstractHandler;

/**
 * Blackhole
 *
 * @memberOf Jymfony.Component.Logger.Handler
 */
class NullHandler extends AbstractHandler {
    /**
     * @inheritdoc
     */
    handle(record) {
        return this.isHandling(record);
    }
}

module.exports = NullHandler;
