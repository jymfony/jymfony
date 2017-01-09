/**
 * Value holder for lexer.
 * You can modify the value into your getType implementation.
 *
 * @memberOf Jymfony.Lexer
 * @type ValueHolder
 */
module.exports = class ValueHolder {
    constructor(value) {
        this.value = value;
    }

    get value() {
        return this._value;
    }

    set value(value) {
        this._value = value.toString();
    }
};
