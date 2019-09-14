/* eslint-disable no-unused-vars */

const CustomDefinition = Jymfony.Component.DependencyInjection.Fixtures.CustomDefinition;
const ServiceSubscriberInterface = Jymfony.Component.DependencyInjection.ServiceSubscriberInterface;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Fixtures
 */
class TestServiceSubscriber extends implementationOf(ServiceSubscriberInterface) {
    __construct(container) {
    }

    static * getSubscribedServices() {
        yield ReflectionClass.getClassName(__self);
        yield '?' + ReflectionClass.getClassName(CustomDefinition);
        yield [ 'bar', ReflectionClass.getClassName(CustomDefinition) ];
        yield [ 'baz', '?' + ReflectionClass.getClassName(CustomDefinition) ];
    }
}

module.exports = TestServiceSubscriber;
