const BaseServiceLocator = Jymfony.Component.DependencyInjection.ServiceLocator;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Argument
 *
 * @internal
 */
export default class ServiceLocator extends BaseServiceLocator {
    /**
     * Constructor.
     *
     * @param {Invokable} factory
     * @param {Object.<string, *>} serviceMap
     */
    __construct(factory, serviceMap) {
        this._factory = factory;
        this._serviceMap = serviceMap;

        super.__construct(serviceMap);
    }

    /**
     * @inheritdoc
     */
    get(id) {
        return undefined !== this._serviceMap[id] ? (this._factory)(...this._serviceMap[id]) : super.get(id);
    }
}
