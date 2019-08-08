const PatternInterface = require('./PatternInterface');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class ArrayPattern extends implementationOf(PatternInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.SourceLocation} location
     * @param {(null|Jymfony.Component.Autoloader.Parser.AST.PatternInterface)[]} elements
     */
    __construct(location, elements) {
        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.SourceLocation}
         */
        this.location = location;

        /**
         * @type {(null|Jymfony.Component.Autoloader.Parser.AST.PatternInterface)[]}
         *
         * @private
         */
        this._elements = isArray(elements) ? elements : [ elements ];
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler._emit('[ ');

        for (const i in this._elements) {
            const element = this._elements[i];
            if (null !== element) {
                compiler.compileNode(element);
            }

            if (i != this._elements.length - 1) {
                compiler._emit(', ');
            }
        }

        compiler._emit(' ]');
    }
}

module.exports = ArrayPattern;
