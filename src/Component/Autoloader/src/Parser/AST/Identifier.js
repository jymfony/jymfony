const ExpressionInterface = require('./ExpressionInterface');
const NodeInterface = require('./NodeInterface');
const PatternInterface = require('./PatternInterface');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class Identifier extends implementationOf(NodeInterface, ExpressionInterface, PatternInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.SourceLocation} location
     * @param {string} name
     */
    __construct(location, name) {
        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.SourceLocation}
         */
        this.location = location;

        /**
         * @type {string}
         *
         * @private
         */
        this._name = name;

        /**
         * @type {null|string}
         */
        this.docblock = null;
    }

    /**
     * Gets the identifier name.
     *
     * @returns {string}
     */
    get name() {
        return this._name;
    }

    /**
     * @inheritdoc
     */
    get names() {
        return [ this ];
    }

    /**
     * Whether this identifier is a decorator name.
     *
     * @returns {boolean}
     */
    get isDecoratorIdentifier() {
        return '@' === this._name[0];
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler._emit(this._name);
    }
}

module.exports = Identifier;
