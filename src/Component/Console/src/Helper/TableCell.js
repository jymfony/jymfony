/**
 * @memberOf Jymfony.Component.Console.Helper
 */
class TableCell {
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
        this._value = value.toString();

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
     * @return {string}
     */
    toString() {
        return this._value;
    }

    /**
     * Gets number of colspan.
     *
     * @return {int}
     */
    getColspan() {
        return this._options.colspan;
    }
}

module.exports = TableCell;
