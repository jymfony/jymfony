/**
 * Represents a single suggested value.
 *
 * @memberOf Jymfony.Component.Console.Completion
 */
export default class Suggestion {
    /**
     * Constructor.
     *
     * @param {string} value
     */
    __construct(value) {
        /**
         * @type {string}
         *
         * @private
         */
        this._value = value;
    }

    /**
     * @returns {string}
     */
    get value() {
        return this._value;
    }

    /**
     * @returns {string}
     */
    toString() {
        return this.value;
    }
}
