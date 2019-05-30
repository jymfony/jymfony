const AbstractClass = Jymfony.Component.VarExporter.Fixtures.AbstractClass;

/**
 * @memberOf Jymfony.Component.VarExporter.Fixtures
 */
class ConcreteClass extends AbstractClass {
    __construct() {
        this._foo = 123;
        this.setBar(234);
    }
}

module.exports = ConcreteClass;
