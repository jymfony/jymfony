const NodeInterface = require('./NodeInterface');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class Argument extends implementationOf(NodeInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.SourceLocation} location
     * @param {Jymfony.Component.Autoloader.Parser.AST.PatternInterface} pattern
     */
    __construct(location, pattern) {
        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.SourceLocation}
         */
        this.location = location;

        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.PatternInterface|Jymfony.Component.Autoloader.Parser.AST.RestElement}
         *
         * @private
         */
        this._pattern = pattern;

        /**
         * @type {null|Jymfony.Component.Autoloader.Parser.AST.AppliedDecorator[]}
         */
        this.decorators = null;

        /**
         * @type {null|Jymfony.Component.Autoloader.Parser.AST.Function}
         */
        this.function = null;
    }

    /**
     * Gets the argument pattern.
     *
     * @returns {Jymfony.Component.Autoloader.Parser.AST.PatternInterface|Jymfony.Component.Autoloader.Parser.AST.RestElement}
     */
    get pattern() {
        return this._pattern;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler.compileNode(this._pattern);
    }

    /**
     * @inheritdoc
     */
    compileDecorators(compiler, target) {
        /**
         * @param {Jymfony.Component.Autoloader.Parser.AST.AppliedDecorator} a
         * @param {Jymfony.Component.Autoloader.Parser.AST.AppliedDecorator} b
         */
        const sortDecorators = (a, b) => {
            const aPriority = a.priority;
            const bPriority = b.priority;

            return aPriority > bPriority ? 1 : (bPriority > aPriority ? -1 : 0);
        };

        const tail = [];
        for (const decorator of (this.decorators || []).sort(sortDecorators)) {
            tail.push(...decorator.compile(compiler, target, this));
        }

        return tail;
    }
}

module.exports = Argument;
