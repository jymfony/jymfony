/**
 * @memberOf Jymfony.Component.VarExporter.Fixtures
 */
class MyWakeup {
    __construct() {
        this.sub = undefined;
        this.biz = undefined;
        this.bis = undefined;
        this.baz = undefined;
        this.def = 234;
    }

    __sleep() {
        return [ 'sub', 'baz' ];
    }

    __wakeup() {
        if (123 === this.sub) {
            this.bis = 123;
            this.baz = 123;
        }
    }
}

module.exports = MyWakeup;
