/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class Position {
    /**
     * Constructor.
     *
     * @param {int} line
     * @param {int} column
     */
    constructor(line, column) {
        /**
         * @type {int}
         *
         * @private
         */
        this._line = line;

        /**
         * @type {int}
         *
         * @private
         */
        this._column = column;
    }

    /**
     * Gets the line number (>= 1).
     *
     * @returns {int}
     */
    get line() {
        return this._line;
    }

    /**
     * Gets the column number (>= 0)
     *
     * @returns {int}
     */
    get column() {
        return this._column;
    }
}

module.exports = Position;
