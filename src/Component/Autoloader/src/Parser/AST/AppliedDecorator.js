const ArrowFunctionExpression = require('./ArrowFunctionExpression');
const CallExpression = require('./CallExpression');
const Identifier = require('./Identifier');
const NodeInterface = require('./NodeInterface');
const VariableDeclaration = require('./VariableDeclaration');
const VariableDeclarator = require('./VariableDeclarator');
const { createHash } = require('crypto');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class AppliedDecorator extends implementationOf(NodeInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.SourceLocation} location
     * @param {Jymfony.Component.Autoloader.Parser.AST.DecoratorDescriptor} decorator
     * @param {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface[]} args
     */
    __construct(location, decorator, args) {
        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.SourceLocation}
         */
        this.location = location;

        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.DecoratorDescriptor}
         *
         * @private
         */
        this._decorator = decorator;

        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface[]}
         *
         * @private
         */
        this._args = args;

        /**
         * @type {string}
         *
         * @private
         */
        this._mangled = undefined;
    }

    /**
     * Gets the decorator descriptor.
     *
     * @returns {Jymfony.Component.Autoloader.Parser.AST.DecoratorDescriptor}
     */
    get decorator() {
        return this._decorator;
    }

    /**
     * Gets the mangled name of the callback.
     *
     * @returns {string}
     */
    get mangledName() {
        if (undefined !== this._mangled) {
            return this._mangled;
        }

        const hash = createHash('sha512');
        hash.update(JSON.stringify(this.location));

        return this._mangled = '__δdecorators__' + this._decorator.name.name.substr(1) + hash.digest().toString('hex');
    }

    /**
     * Gets the callback expression.
     *
     * @returns {Jymfony.Component.Autoloader.Parser.AST.Function}
     */
    get callback() {
        return new ArrowFunctionExpression(null, new CallExpression(null, new Identifier(null, this._decorator.mangledName), this._args));
    }

    /**
     * Gets the arguments of the applied decorator.
     *
     * @returns {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface[]}
     */
    get args() {
        return this._args;
    }

    /**
     * Generates code for decorator application.
     *
     * @param {Jymfony.Component.Autoloader.Parser.Compiler} compiler
     * @param {Jymfony.Component.Autoloader.Parser.AST.Class} target
     * @param {[Jymfony.Component.Autoloader.Parser.AST.Identifier, Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface]} id
     * @param {string} variable
     *
     * @returns {Jymfony.Component.Autoloader.Parser.AST.StatementInterface[]}
     */
    apply(compiler, target, id, variable) {
        return this._decorator.apply(compiler, target, id, variable);
    }

    /**
     * Compiles a decorator.
     *
     * @param {Jymfony.Component.Autoloader.Parser.Compiler} compiler
     * @param {Jymfony.Component.Autoloader.Parser.AST.Class} target
     * @param {[Jymfony.Component.Autoloader.Parser.AST.Identifier, Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface]} id
     *
     * @returns {Jymfony.Component.Autoloader.Parser.AST.StatementInterface[]}
     */
    compile(compiler, target, id) {
        const variableName = compiler.generateVariableName();
        compiler.compileNode(new VariableDeclaration(null, 'const', [
            new VariableDeclarator(null,
                new Identifier(null, variableName),
                new CallExpression(null, new Identifier(null, this._decorator.mangledName), this._args)
            ),
        ]));
        compiler._emit(';\n');

        return this._decorator.apply(compiler, target, id, variableName);
    }
}

module.exports = AppliedDecorator;
