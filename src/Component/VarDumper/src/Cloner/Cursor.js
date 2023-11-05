/**
 * Represents the current state of a dumper while dumping.
 *
 * @memberOf Jymfony.Component.VarDumper.Cloner
 */
export default class Cursor {
    depth = 0;
    refIndex = 0;
    softRefTo = 0;
    softRefCount = 0;
    hashType;
    hashKey;
    hashIndex = 0;
    hashLength = 0;
    hashCut = 0;
    stop = false;
    attr = {};
    skipChildren = false;
}
