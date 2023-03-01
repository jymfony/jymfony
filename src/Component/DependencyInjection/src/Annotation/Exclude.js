const Annotation = Jymfony.Component.Autoloader.Decorator.Annotation;

/**
 * An attribute to tell the class should not be registered as service.
 *
 * @memberOf Jymfony.Component.DependencyInjection.Annotation
 */
export default
@Annotation(Annotation.ANNOTATION_TARGET_CLASS)
class Exclude {
    /**
     * Constructor.
     *
     * @param {string | undefined} [env]
     */
    __construct(env = undefined) {
        /**
         * @type {string | undefined}
         *
         * @private
         */
        this._env = env;
    }

    /**
     * @return {string|undefined}
     */
    get env() {
        return this._env;
    }
}
