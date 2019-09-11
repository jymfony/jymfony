/**
 * Value holder for lexer.
 * You can modify the value into your getType implementation.
 *
 * @memberOf Jymfony.Component.Lexer
 */
export default class ValueHolder {
    /**
     * Constructor.
     *
     * @param {*} value
     */
    __construct(value) {
        this.value = value;
    }

    /**
     * @returns {*}
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
