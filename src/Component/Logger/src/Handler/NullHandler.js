const AbstractHandler = Jymfony.Component.Logger.Handler.AbstractHandler;

/**
 * Blackhole.
 *
 * @memberOf Jymfony.Component.Logger.Handler
 */
export default class NullHandler extends AbstractHandler {
    /**
     * @inheritdoc
     */
    handle(record) {
        return this.isHandling(record);
    }
}
