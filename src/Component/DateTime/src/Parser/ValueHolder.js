const ValueHolderInterface = Jymfony.Contracts.Lexer.ValueHolderInterface;

/**
 * Value holder for date-time lexer.
 * You can modify the value into your getType implementation.
 *
 * @memberOf Jymfony.Component.DateTime.Parser
 */
export default class ValueHolder extends implementationOf(ValueHolderInterface) {
    /**
     * Constructor.
     *
     * @param {*} value
     */
    __construct(value) {
        /**
         * @type {*}
         *
         * @private
         */
        this._value = value;
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
        this._value = value;
    }
}
