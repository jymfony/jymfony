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
        this._options = Object.assign({ rowspan: 1, colspan: 1 }, this._options, options);
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

    /**
     * Gets number of rowspan.
     *
     * @return {int}
     */
    getRowspan() {
        return this._options.rowspan;
    }
}

module.exports = TableCell;
