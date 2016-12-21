const InstantiatorInterface = Jymfony.DependencyInjection.LazyProxy.InstantiatorInterface;

/**
 * @memberOf Jymfony.DependencyInjection.LazyProxy
 */
module.exports = class RealServiceInstantiator extends implementationOf(InstantiatorInterface) {
    /**
     * @inheritDoc
     */
    instantiateProxy(container, definition, id, initializer) {
        initializer.call(null);
    }
};
