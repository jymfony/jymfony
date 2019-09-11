const ImportSpecifierInterface = require('./ImportSpecifierInterface');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class ImportDefaultSpecifier extends implementationOf(ImportSpecifierInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.SourceLocation} location
     * @param {Jymfony.Component.Autoloader.Parser.AST.Identifier} local
     */
    __construct(location, local) {
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
     * @inheritdoc
     */
    compile(/* compiler */) {
        throw new Error('Should not be called');
    }
}

module.exports = ImportDefaultSpecifier;
