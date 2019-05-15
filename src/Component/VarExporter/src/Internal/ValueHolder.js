/**
 * Value holder for reference passing.
 *
 * @template T
 * @memberOf Jymfony.Component.VarExporter.Internal
 */
class ValueHolder {
    /**
     * Constructor.
     *
     * @param {T} value
     * @template T
     */
    __construct(value) {
        this.value = value;
    }

    /**
     * @returns {T}
     * @template T
     */
    get value() {
        return this._value;
    }

    /**
     * @param {T} value
     * @template T
     */
    set value(value) {
        /**
         * @type {string}
         *
         * @private
         */
        this._value = value.toString();
    }
}

module.exports = ValueHolder;
