/**
 * Value holder for lexer.
 * You can modify the value into your getType implementation.
 *
 * @memberOf Jymfony.Component.Autoloader.Parser
 */
class ValueHolder {
    /**
     * Constructor.
     *
     * @param {*} value
     */
    constructor(value) {
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
        this._value = value.toString();
    }
}

module.exports = ValueHolder;
