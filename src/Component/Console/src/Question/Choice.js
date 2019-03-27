/**
 * Represents a choice in question.
 *
 * @memberOf Jymfony.Component.Console.Question
 */
class Choice {
    /**
     * Constructor.
     *
     * @param {string} label
     * @param {*} value
     */
    __construct(label, value) {
        this._label = label;
        this._value = value;
    }

    /**
     * Gets the choice label.
     *
     * @returns {string}
     */
    get label() {
        return this._label;
    }

    /**
     * Gets the choice value.
     *
     * @returns {*}
     */
    get value() {
        return this._value;
    }

    /**
     * Checks whether a choice is equal to another.
     *
     * @param {Jymfony.Component.Console.Question.Choice} choice
     *
     * @returns {boolean}
     */
    isEqual(choice) {
        return __jymfony.equal(choice._value, this._value);
    }
}

module.exports = Choice;
