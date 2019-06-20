const Caster = Jymfony.Component.VarDumper.Caster.Caster;
const Stub = Jymfony.Component.VarDumper.Cloner.Stub;

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

            if (Stub.TYPE_REF === stub.type && ! c.class_ && isString(c.value)) {
                stub.type = Stub.TYPE_STRING;
            }

            a = {};
        }

        return a;
    }

    /**
     * @param {Object} obj
     * @param {Object} a
     * @param {Jymfony.Component.VarDumper.Cloner.Stub} stub
     * @param {boolean} isNested
     *
     * @returns {Object}
     */
    static cutInternals(obj, a, stub, isNested) {
        if (isNested) {
            stub.attr.cut += __jymfony.keys(a).length;

            return {};
        }

        return a;
    }

    /**
     * @param {Jymfony.Component.VarDumper.Caster.EnumStub} c
     * @param {Object} a
     * @param {Jymfony.Component.VarDumper.Cloner.Stub} stub
     * @param {boolean} isNested
     */
    static castEnum(c, a, stub, isNested) {
        if (isNested) {
            stub.class_ = c.dumpKeys ? '' : null;
            stub.handle = 0;
            stub.value = undefined;
            stub.attr = c.attr;

            a = {};

            if (c.value) {
                for (const [ k, value ] of __jymfony.getEntries(c.value)) {
                    const key = '\0' !== k[0] ? Caster.PREFIX_VIRTUAL + k : k;
                    a[key] = value;
                }
            }
        }

        return a;
    }
}

module.exports = StubCaster;
