/**
 * Value holder for lexer.
 * You can modify the value into your getType implementation.
 *
 * @memberOf Jymfony.Lexer
 */
class ValueHolder {
    /**
     * Constructor.
     *
     * @param {*} value
     */
    __construct(value) {
        this.value = value;
    }

    /**
     * @returns {string}
     */
    get value() {
        return this._value;
    }

    /**
     * @param {*} value
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
