const ServiceSubscriberInterface = Jymfony.Component.DependencyInjection.ServiceSubscriberInterface;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Fixtures.Integration
 */
export default class ServiceSubscriberStub extends implementationOf(ServiceSubscriberInterface) {
    static getSubscribedServices() {
        return [];
    }
}
