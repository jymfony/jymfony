const InstantiatorInterface = Jymfony.Component.DependencyInjection.LazyProxy.InstantiatorInterface;

/**
 * @memberOf Jymfony.Component.DependencyInjection.LazyProxy
 */
export default class RealServiceInstantiator extends implementationOf(InstantiatorInterface) {
    /**
     * @inheritdoc
     */
    instantiateProxy(container, definition, id, initializer) {
        initializer.call(null);
    }
}
