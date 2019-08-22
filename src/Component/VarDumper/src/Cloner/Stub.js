/**
 * Represents the main properties of a variable.
 *
 * @memberOf Jymfony.Component.VarDumper.Cloner
 */
export default class Stub {
    /**
     * Constructor.
     */
    __construct() {
        /**
         * Variable type.
         *
         * @type {int}
         */
        this.type = __self.TYPE_REF;

        /**
         * The object class.
         *
         * @type {string}
         */
        this.class_ = '';

        /**
         * The real value.
         *
         * @type {*}
         */
        this.value = undefined;

        /**
         * Object id (handle).
         *
         * @type {int}
         */
        this.handle = undefined;

        /**
         * Ref counter.
         *
         * @type {number}
         */
        this.refCount = 0;

        /**
         * Attributes.
         *
         * @type {*}
         */
        this.attr = {};
    }
}

Stub.TYPE_REF = 1;
Stub.TYPE_STRING = 2;
Stub.TYPE_ARRAY = 3;
Stub.TYPE_OBJECT = 4;
Stub.TYPE_SYMBOL = 5;
