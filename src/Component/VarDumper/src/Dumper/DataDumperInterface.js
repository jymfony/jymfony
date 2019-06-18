/**
 * DataDumperInterface for dumping Data objects.
 *
 * @memberOf Jymfony.Component.VarDumper.Dumper
 */
class DataDumperInterface {
    /**
     * Dumps data object.
     *
     * @param {Jymfony.Component.VarDumper.Cloner.Data} data
     */
    dump(data) { }
}

module.exports = getInterface(DataDumperInterface);
