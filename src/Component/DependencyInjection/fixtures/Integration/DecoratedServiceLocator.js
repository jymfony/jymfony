const ContainerInterface = Jymfony.Contracts.DependencyInjection.ContainerInterface;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Fixtures.Integration
 */
export default class DecoratedServiceLocator extends implementationOf(ContainerInterface) {
    __construct(locator) {
        this._locator = locator;
    }

    get(id) {
        return this._locator.get(id);
    }

    has(id) {
        return this._locator.has(id);
    }
}
