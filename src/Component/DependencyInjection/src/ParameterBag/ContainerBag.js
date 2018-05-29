const ContainerBagInterface = Jymfony.Component.DependencyInjection.ParameterBag.ContainerBagInterface;
const FrozenParameterBag = Jymfony.Component.DependencyInjection.ParameterBag.FrozenParameterBag;

/**
 * @memberOf Jymfony.Component.DependencyInjection.ParameterBag
 */
class ContainerBag extends mix(FrozenParameterBag, ContainerBagInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.DependencyInjection.Container} container
     */
    __construct(container) {
        /**
         * @type {Jymfony.Component.DependencyInjection.Container}
         *
         * @private
         */
        this._container = container;
    }

    /**
     * @inheritdoc
     */
    all() {
        return this._container.parameterBag.all();
    }

    /**
     * @inheritdoc
     */
    get(name) {
        return this._container.getParameter(name);
    }

    /**
     * @inheritdoc
     */
    has(name) {
        return this._container.hasParameter(name);
    }
}

module.exports = ContainerBag;
