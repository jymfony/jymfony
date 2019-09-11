const ImportSpecifierInterface = require('./ImportSpecifierInterface');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class ImportSpecifier extends implementationOf(ImportSpecifierInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.SourceLocation} location
     * @param {Jymfony.Component.Autoloader.Parser.AST.Identifier} local
     * @param {Jymfony.Component.Autoloader.Parser.AST.Identifier} imported
     */
    __construct(location, local, imported) {
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
        this._imported = imported;
    }

    /**
     * Gets the local part.
     *
     * @returns {Jymfony.Component.Autoloader.Parser.AST.Identifier}
     */
    get local() {
        return this._local;
    }

    /**
     * Gets the imported part.
     *
     * @returns {Jymfony.Component.Autoloader.Parser.AST.Identifier}
     */
    get imported() {
        return this._imported;
    }

    /**
     * @inheritdoc
     */
    compile(/* compiler */) {
        throw new Error('Should not be called directly');
    }
}

module.exports = ImportSpecifier;
