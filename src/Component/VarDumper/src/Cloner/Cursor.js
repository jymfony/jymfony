/**
 * Represents the current state of a dumper while dumping.
 *
 * @memberOf Jymfony.Component.VarDumper.Cloner
 */
class Cursor {
    constructor() {
        this.depth = 0;
        this.refIndex = 0;
        this.softRefTo = 0;
        this.softRefCount = 0;
        this.hashType = undefined;
        this.hashKey = undefined;
        this.hashIndex = 0;
        this.hashLength = 0;
        this.hashCut = 0;
        this.stop = false;
        this.attr = {};
        this.skipChildren = false;
    }
}

module.exports = Cursor;
