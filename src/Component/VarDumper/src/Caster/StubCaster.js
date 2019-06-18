/**
 * @memberOf Jymfony.Component.VarDumper.Caster
 */
class StubCaster {
    /**
     * @param {Jymfony.Component.VarDumper.Cloner.Stub} c
     * @param {Object} a
     * @param {Jymfony.Component.VarDumper.Cloner.Stub} stub
     * @param {boolean} isNested
     */
    static castStub(c, a, stub, isNested) {
        if (isNested) {
            stub.type = c.type;
            stub.class_ = c.class_;
            stub.value = c.value;
            stub.handle = c.handle;
            stub.attr = { ...c.attr, position: stub.attr.position };

            a = {};
        }

        return a;
    }
}

module.exports = StubCaster;
