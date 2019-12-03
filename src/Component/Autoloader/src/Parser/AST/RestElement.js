const PatternInterface = require('./PatternInterface');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class RestElement extends implementationOf(PatternInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.SourceLocation} location
     * @param {Jymfony.Component.Autoloader.Parser.AST.PatternInterface} argument
     */
    __construct(location, argument) {
        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.SourceLocation}
         */
        this.location = location;

        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.PatternInterface}
         *
         * @private
         */
        this._argument = argument;
    }

    /**
     * Gets the rest argument.
     *
     * @returns {Jymfony.Component.Autoloader.Parser.AST.PatternInterface}
     */
    get argument() {
        return this._argument;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler._emit('...');
        compiler.compileNode(this._argument);
    }
}

module.exports = RestElement;
