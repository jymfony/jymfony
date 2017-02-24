const InstantiatorInterface = Jymfony.Component.DependencyInjection.LazyProxy.InstantiatorInterface;

/**
 * @memberOf Jymfony.Component.DependencyInjection.LazyProxy
 */
module.exports = class RealServiceInstantiator extends implementationOf(InstantiatorInterface) {
    /**
     * @inheritDoc
     */
    instantiateProxy(container, definition, id, initializer) {
        initializer.call(null);
    }
};
