const BooleanLiteral = require('./BooleanLiteral');
const CallExpression = require('./CallExpression');
const ExpressionStatement = require('./ExpressionStatement');
const Identifier = require('./Identifier');
const MemberExpression = require('./MemberExpression');
const NodeInterface = require('./NodeInterface');
const ObjectExpression = require('./ObjectExpression');
const ObjectProperty = require('./ObjectProperty');
const StringLiteral = require('./StringLiteral');

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

        /**
         * @type {boolean}
         *
         * @private
         */
        this._prepared = false;

        /**
         * @type {boolean}
         */
        this.esModule = false;
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
     * Prepares the program body.
     */
    prepare() {
        if (this._prepared) {
            return;
        }

        this._prepared = true;
        if (this.esModule) {
            this._body.unshift(
                new ExpressionStatement(null, new CallExpression(null,
                    new MemberExpression(null, new Identifier(null, 'Object'), new Identifier(null, 'defineProperty')),
                    [
                        new Identifier(null, 'exports'),
                        new StringLiteral(null, '"__esModule"'),
                        new ObjectExpression(null, [
                            new ObjectProperty(null, new Identifier(null, 'value'), new BooleanLiteral(null, true)),
                        ]),
                    ]
                ))
            );
        }
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
