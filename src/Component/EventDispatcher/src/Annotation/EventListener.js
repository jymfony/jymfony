const Annotation = Jymfony.Component.Autoloader.Decorator.Annotation;

/**
 * Service tag to autoconfigure event listeners.
 *
 * @memberOf Jymfony.Component.EventDispatcher.Annotation
 */
export default
@Annotation(Annotation.ANNOTATION_TARGET_CLASS | Annotation.ANNOTATION_TARGET_METHOD)
class EventListener {
    /**
     * Constructor.
     *
     * @param {string | Function} event
     * @param {string} method
     * @param {int} priority
     */
    __construct({ event, method = null, priority = 0 }) {
        if (isFunction(event)) {
            event = ReflectionClass.getClassName(event);
        }

        if (undefined === event) {
            throw new LogicException('Invalid EventListener annotation: the event property must be passed in the argument');
        }

        /**
         * @type {string | null}
         *
         * @private
         */
        this._event = event;

        /**
         * @type {string | null}
         *
         * @private
         */
        this._method = method;

        /**
         * @type {int}
         *
         * @private
         */
        this._priority = priority;
    }

    /**
     * @returns {string | null}
     */
    get event() {
        return this._event;
    }

    /**
     * @returns {string | null}
     */
    get method() {
        return this._method;
    }

    /**
     * @returns {int}
     */
    get priority() {
        return this._priority;
    }
}
