const ImportSpecifierInterface = require('./ImportSpecifierInterface');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class ExportSpecifier extends implementationOf(ImportSpecifierInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.SourceLocation} location
     * @param {Jymfony.Component.Autoloader.Parser.AST.Identifier} local
     * @param {Jymfony.Component.Autoloader.Parser.AST.Identifier} exported
     */
    __construct(location, local, exported) {
        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.SourceLocation}
         */
        this.location = location;

        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.Identifier}
         *
         * @private
         */
        this._local = local;

        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.Identifier}
         *
         * @private
         */
        this._exported = exported;
    }

    /**
     * Gets the local name.
     *
     * @returns {Jymfony.Component.Autoloader.Parser.AST.Identifier}
     */
    get local() {
        return this._local;
    }

    /**
     * Gets the exported name.
     *
     * @returns {Jymfony.Component.Autoloader.Parser.AST.Identifier}
     */
    get exported() {
        return this._exported;
    }
}

module.exports = ExportSpecifier;
