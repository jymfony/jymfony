/**
 * Represents a var cloner.
 * Implementors should serialize any js into a Data object.
 *
 * @memberOf Jymfony.Component.VarDumper.Cloner
 */
class ClonerInterface {
    /**
     * Clones a JS variable.
     *
     * @param {*} variable
     *
     * @returns {Jymfony.Component.VarDumper.Cloner.Data}
     */
    cloneVar(variable) { }
}

module.exports = getInterface(ClonerInterface);
