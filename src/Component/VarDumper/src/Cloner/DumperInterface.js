/**
 * DumperInterface used by Data objects.
 *
 * @memberOf Jymfony.Component.VarDumper.Cloner
 */
class DumperInterface {
    /**
     * Dumps a scalar value.
     *
     * @param {Jymfony.Component.VarDumper.Cloner.Cursor} cursor The Cursor position in the dump
     * @param {string} type The PHP type of the value being dumped
     * @param {string|int|float|boolean} value The scalar value being dumped
     */
    dumpScalar(cursor, type, value) { }

    /**
     * Dumps a string.
     *
     * @param {Jymfony.Component.VarDumper.Cloner.Cursor} cursor The Cursor position in the dump
     * @param {string} str The string being dumped
     * @param {int} cut The number of characters $str has been cut by
     */
    dumpString(cursor, str, cut) { }

    /**
     * Dumps while entering an hash.
     *
     * @param {Jymfony.Component.VarDumper.Cloner.Cursor} cursor The Cursor position in the dump
     * @param {int} type A Stub.TYPE_* const for the type of hash
     * @param {string} class_ The object class, resource type or array count
     * @param {boolean} hasChild When the dump of the hash has child item
     */
    enterHash(cursor, type, class_, hasChild) { }

    /**
     * Dumps while leaving an hash.
     *
     * @param {Jymfony.Component.VarDumper.Cloner.Cursor} cursor The Cursor position in the dump
     * @param {int} type A Cursor::HASH_* const for the type of hash
     * @param {string} class_ The object class, resource type or array count
     * @param {boolean} hasChild When the dump of the hash has child item
     * @param {int} cut The number of items the hash has been cut by
     */
    leaveHash(cursor, type, class_, hasChild, cut) { }
}

export default getInterface(DumperInterface);
