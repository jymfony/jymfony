const PatternInterface = require('./PatternInterface');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class AssignmentPattern extends implementationOf(PatternInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.SourceLocation} location
     * @param {Jymfony.Component.Autoloader.Parser.AST.PatternInterface|Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface} left
     * @param {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface} right
     */
    __construct(location, left, right) {
        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.SourceLocation}
         */
        this.location = location;

        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.PatternInterface}
         *
         * @private
         */
        this._left = left;

        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface}
         *
         * @private
         */
        this._right = right;
    }

    /**
     * Gets the left hand of the pattern.
     *
     * @returns {Jymfony.Component.Autoloader.Parser.AST.PatternInterface}
     */
    get left() {
        return this._left;
    }

    /**
     * Gets the right hand of the pattern.
     *
     * @returns {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface}
     */
    get right() {
        return this._right;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler.compileNode(this._left);
        compiler._emit(' = ');
        compiler.compileNode(this._right);
    }
}

module.exports = AssignmentPattern;
