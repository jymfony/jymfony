const InstantiatorInterface = Jymfony.Component.DependencyInjection.LazyProxy.InstantiatorInterface;

/**
 * @memberOf Jymfony.Component.DependencyInjection.LazyProxy
 */
class RealServiceInstantiator extends implementationOf(InstantiatorInterface) {
    /**
     * @inheritdoc
     */
    instantiateProxy(container, definition, id, initializer) {
        initializer.call(null);
    }
}

module.exports = RealServiceInstantiator;
