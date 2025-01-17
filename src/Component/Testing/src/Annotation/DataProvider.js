const Annotation = Jymfony.Component.Autoloader.Decorator.Annotation;

/**
 * @memberOf Jymfony.Component.Testing.Annotation
 */
export default
@Annotation(Annotation.ANNOTATION_TARGET_METHOD)
class DataProvider {
    /**
     * @type {string}
     *
     * @private
     */
    _provider;

    /**
     * Constructor.
     *
     * @param {string} provider
     */
    __construct(provider) {
        this._provider = provider;
    }

    /**
     * Gets the provider method name.
     *
     * @returns {string}
     */
    get provider() {
        return this._provider;
    }
}
