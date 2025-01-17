/**
 * Represents the main properties of a variable.
 *
 * @memberOf Jymfony.Component.VarDumper.Cloner
 */
export default class Stub {
    /**
     * Variable type.
     *
     * @type {int}
     */
    type = __self.TYPE_REF;

    /**
     * The object class.
     *
     * @type {string}
     */
    class_ = '';

    /**
     * The real value.
     *
     * @type {*}
     */
    value;

    /**
     * Object id (handle).
     *
     * @type {int}
     */
    handle;

    /**
     * Ref counter.
     *
     * @type {number}
     */
    refCount = 0;

    /**
     * Attributes.
     *
     * @type {*}
     */
    attr = {};
}

Stub.TYPE_REF = 1;
Stub.TYPE_STRING = 2;
Stub.TYPE_ARRAY = 3;
Stub.TYPE_OBJECT = 4;
Stub.TYPE_SYMBOL = 5;
