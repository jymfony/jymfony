const Stub = Jymfony.Component.VarDumper.Cloner.Stub;

/**
 * Represents a constant and its value.
 *
 * @memberOf Jymfony.Component.VarDumper.Caster
 */
export default class ConstStub extends Stub {
    /**
     * Constructor.
     *
     * @param {string} name
     * @param {*} value
     */
    __construct(name, value = undefined) {
        super.__construct();

        this.class_ = name;
        this.value = undefined !== value ? value : name;
    }

    toString() {
        return this.value.toString();
    }
}
