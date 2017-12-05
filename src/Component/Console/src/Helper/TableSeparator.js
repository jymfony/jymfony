const TableCell = Jymfony.Component.Console.Helper.TableCell;

/**
 * Marks a row as being a separator.
 *
 * @memberOf {Jymfony.Component.Console.Helper}
 */
class TableSeparator extends TableCell {
    /**
     * @param {Object} options
     *
     * @private
     */
    __construct(options = {}) {
        super.__construct('', options);
    }
}

module.exports = TableSeparator;
