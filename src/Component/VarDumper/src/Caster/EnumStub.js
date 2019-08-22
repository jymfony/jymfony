const Stub = Jymfony.Component.VarDumper.Cloner.Stub;

/**
 * Represents an enumeration of values.
 *
 * @memberOf Jymfony.Component.VarDumper.Caster
 */
export default class EnumStub extends Stub {
    __construct(values, dumpKeys = true) {
        super.__construct();

        this.value = values;
        this.dumpKeys = dumpKeys;
    }
}
