/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class SourceLocation {
    /**
     * Constructor.
     *
     * @param {string} source
     * @param {Jymfony.Component.Autoloader.Parser.AST.Position} start
     * @param {Jymfony.Component.Autoloader.Parser.AST.Position} end
     */
    constructor(source, start, end) {
        /**
         * @type {string}
         *
         * @private
         */
        this._source = source;

        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.Position}
         *
         * @private
         */
        this._start = start;

        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.Position}
         *
         * @private
         */
        this._end = end;
    }

    /**
     * Gets the source start position.
     *
     * @returns {Jymfony.Component.Autoloader.Parser.AST.Position}
     */
    get start() {
        return this._start;
    }
}

module.exports = SourceLocation;
