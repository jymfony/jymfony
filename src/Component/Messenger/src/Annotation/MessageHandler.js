const Annotation = Jymfony.Component.Autoloader.Decorator.Annotation;

/**
 * Service tag to autoconfigure message handlers.
 *
 * @memberOf Jymfony.Component.Messenger.Annotation
 */
export default
@Annotation(Annotation.ANNOTATION_TARGET_CLASS | Annotation.ANNOTATION_TARGET_METHOD)
class MessageHandler {
    /**
     * Constructor.
     *
     * @param {string} [bus]
     * @param {string} [fromTransport]
     * @param {string} [handles]
     * @param {string} [method]
     * @param {int} [priority]
     */
    __construct({
        bus,
        fromTransport,
        handles,
        method,
        priority,
    } = {}) {
        this._bus = bus;
        this._fromTransport = fromTransport;
        this._handles = handles;
        this._method = method;
        this._priority = priority || 0;
    }

    get asTag() {
        return Object.filter({
            bus: this._bus,
            from_transport: this._fromTransport,
            handles: this._handles,
            method: this._method,
            priority: this._priority,
        }, v => v !== undefined);
    }
}
