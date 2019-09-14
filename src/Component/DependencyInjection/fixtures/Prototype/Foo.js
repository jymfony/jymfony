/* eslint-disable no-unused-vars */

const FooInterface = Jymfony.Component.DependencyInjection.Fixtures.Prototype.FooInterface;
const Sub = Jymfony.Component.DependencyInjection.Fixtures.Prototype.Sub;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Fixtures.Prototype
 */
export default class Foo extends implementationOf(FooInterface, Sub.BarInterface) {
    __construct(bar = null) {
    }

    setFoo(foo) {
    }
}
