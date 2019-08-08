const NodeInterface = require('./NodeInterface');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class Program extends implementationOf(NodeInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.SourceLocation} location
     */
    __construct(location) {
        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.SourceLocation}
         */
        this.location = location;

        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.NodeInterface[]}
         *
         * @private
         */
        this._body = [];
    }

    /**
     * Adds a node.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.NodeInterface} node
     */
    add(node) {
        this._body.push(node);
    }

    /**
     * Gets the nodes array.
     *
     * @returns {[]|Array}
     */
    get body() {
        return this._body;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        for (const node of this._body) {
            compiler.compileNode(node);
        }
    }
}

module.exports = Program;
