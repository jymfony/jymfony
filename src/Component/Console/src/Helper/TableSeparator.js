/**
 * Marks a row as being a separator.
 *
 * @memberOf {Jymfony.Component.Console.Helper}
 */
class TableSeparator {
    /**
     * @param {Array} options
     *
     * @private
     */
    __construct(options = []) {
        super.__construct('', options);
    }
}

module.exports = TableSeparator;
