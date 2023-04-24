const Caster = Jymfony.Component.VarDumper.Caster.Caster;

/**
 * @memberOf Jymfony.Component.VarDumper.Caster
 */
export default class DataStructureCaster {
    /**
     * Casts an HashTable object.
     *
     * @param {HashTable} hashTable
     * @param {Object} a
     * @param {Jymfony.Component.VarDumper.Cloner.Stub} stub
     *
     * @returns {Object}
     */
    static castHashTable(hashTable, a, stub) {
        stub.class_ += ':' + hashTable.length;

        return {
            [Caster.PREFIX_VIRTUAL + 'content']: hashTable.toObject(),
        };
    }

    /**
     * Casts a data structure object.
     *
     * @param {PriorityQueue|LinkedList|BTree} object
     * @param {Object} a
     * @param {Jymfony.Component.VarDumper.Cloner.Stub} stub
     *
     * @returns {Object}
     */
    static castDataStructure(object, a, stub) {
        stub.class_ += ':' + object.length;

        return {
            [Caster.PREFIX_VIRTUAL + 'content']: object.toArray(),
        };
    }

    /**
     * Casts a Set object.
     *
     * @param {Set} object
     * @param {Object} a
     * @param {Jymfony.Component.VarDumper.Cloner.Stub} stub
     *
     * @returns {Object}
     */
    static castSet(object, a, stub) {
        stub.class_ += ':' + object.size;

        return {
            [Caster.PREFIX_VIRTUAL + 'values']: [ ...object.values() ],
        };
    }
}
