const Loader = Jymfony.Component.Config.Loader.Loader;

/**
 * JsFileLoader loads service definitions from a js function.
 *
 * @memberOf Jymfony.Component.DependencyInjection.Loader
 */
class FunctionLoader extends Loader {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container A ContainerBuilder instance
     */
    __construct(container) {
        super.__construct();

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

module.exports = FunctionLoader;
