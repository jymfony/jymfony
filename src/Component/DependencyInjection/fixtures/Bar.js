const BarInterface = Jymfony.Component.DependencyInjection.Fixtures.BarInterface;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Fixtures
 */
export default class Bar extends implementationOf(BarInterface) {
    __construct(quz = null, nonExistent = null, decorated = null, foo = []) {
        this._quz = quz;
    }

    static create(nonExistent = null, factory = null) {
    }
}
