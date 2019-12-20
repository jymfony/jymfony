/**
 * @memberOf Jymfony.Component.DependencyInjection.Fixtures.Integration
 */
export default class FooBarTaggedClass {
    __construct(param = []) {
        this._param = param;
    }

    getParam() {
        return this._param;
    }
}
