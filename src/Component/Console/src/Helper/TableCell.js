/**
 * @memberOf Jymfony.Component.Console.Helper
 */
export default class TableCell {
    /**
     * @param {string} [value = '']
     * @param {Object} [options = {}]
     */
    __construct(value = '', options = {}) {
        /**
         * @type {string}
         *
         * @private
         */
        this._value = String(value);

        /**
         * @type {Object}
         *
         * @private
         */
        this._options = Object.assign({ colspan: 1 }, this._options, options);
    }

    /**
     * Returns the cell value.
     *
     * @returns {string}
     */
    toString() {
        return this._value;
    }

    /**
     * Gets number of colspan.
     *
     * @returns {int}
     */
    get colspan() {
        return this._options.colspan;
    }
}
