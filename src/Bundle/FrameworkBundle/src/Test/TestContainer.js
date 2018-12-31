const Container = Jymfony.Component.DependencyInjection.Container;

/**
 * @memberOf Jymfony.Bundle.FrameworkBundle.Test
 */
class TestContainer extends Container {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.DependencyInjection.ParameterBag.ParameterBag} parameterBag
     * @param {Jymfony.Component.DependencyInjection.Container} publicContainer
     * @param {Jymfony.Component.DependencyInjection.ContainerInterface} serviceLocator
     */
    __construct(parameterBag, publicContainer, serviceLocator) {
        this._parameterBag = parameterBag || publicContainer.parameterBag;

        /**
         * @type {Jymfony.Component.DependencyInjection.Container}
         *
         * @private
         */
        this._publicContainer = publicContainer;

        /**
         * @type {Jymfony.Component.DependencyInjection.ContainerInterface}
         *
         * @private
         */
        this._privateContainer = serviceLocator;
    }

    /**
     * @inheritdoc
     */
    compile() {
        this._publicContainer.compile();
    }

    /**
     * @inheritdoc
     */
    get frozen() {
        return this._publicContainer.frozen;
    }

    /**
     * @inheritdoc
     */
    set(id, service) {
        this._publicContainer.set(id, service);
    }

    /**
     * @inheritdoc
     */
    get(id, invalidBehavior = Container.EXCEPTION_ON_INVALID_REFERENCE) {
        return this._publicContainer.get(id, invalidBehavior);
    }

    /**
     * @inheritdoc
     */
    initialized(id) {
        return this._publicContainer.initialized(id);
    }

    /**
     * @inheritdoc
     */
    reset() {
        return this._publicContainer.reset();
    }
}

module.exports = TestContainer;
