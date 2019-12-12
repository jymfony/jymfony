const TableCell = Jymfony.Component.Console.Helper.TableCell;

/**
 * Marks a row as being a separator.
 *
 * @memberOf Jymfony.Component.Console.Helper
 */
export default class TableSeparator extends TableCell {
    /**
     * @param {Object} options
     */
    __construct(options = {}) {
        super.__construct('', options);
    }
}
