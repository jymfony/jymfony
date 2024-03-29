const Loader = Jymfony.Component.Config.Loader.Loader;

/**
 * JsFileLoader loads service definitions from a js function.
 *
 * @memberOf Jymfony.Component.DependencyInjection.Loader
 */
export default class FunctionLoader extends Loader {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container A ContainerBuilder instance
     * @param {string | null} [env = null]
     */
    __construct(container, env = null) {
        super.__construct(env);

        /**
         * @type {Jymfony.Component.DependencyInjection.ContainerBuilder}
         *
         * @private
         */
        this._container = container;
    }

    /**
     * @inheritdoc
     */
    load(resource) {
        resource(this._container);
    }

    /**
     * @inheritdoc
     */
    supports(resource) {
        return isFunction(resource);
    }
}
