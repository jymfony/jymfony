/**
 * @memberOf Jymfony.Component.VarExporter.Fixtures
 */
class AbstractClass {
    __construct() {
        this._foo = undefined;
        this._bar = undefined;
    }

    setBar(bar) {
        this._bar = bar;
    }
}

module.exports = AbstractClass;
