const AppliedDecorator = require('./AppliedDecorator');
const ArrowFunctionExpression = require('./ArrowFunctionExpression');
const CallExpression = require('./CallExpression');
const ClassMethod = require('./ClassMethod');
const ClassProperty = require('./ClassProperty');
const ExpressionStatement = require('./ExpressionStatement');
const Identifier = require('./Identifier');
const StringLiteral = require('./StringLiteral');
const VariableDeclaration = require('./VariableDeclaration');
const VariableDeclarator = require('./VariableDeclarator');
const { createHash } = require('crypto');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class RegisterDecorator extends AppliedDecorator {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.SourceLocation} location
     * @param {Jymfony.Component.Autoloader.Parser.AST.Function} callback
     */
    __construct(location, callback) {
        super.__construct(location, null, [ callback ]);
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

        return this._mangled = '__δdecorators__register' + hash.digest().toString('hex');
    }

    /**
     * @inheritdoc
     */
    apply(compiler, class_, target, variable) {
        const args = [ class_.id ];
        if (target instanceof ClassProperty || target instanceof ClassMethod) {
            const key = target instanceof ClassProperty ? target.key : target.id;
            const name = (target.private ? '#' : '') + key.name;
            args.push(key instanceof Identifier ? new StringLiteral(null, JSON.stringify(name)) : key);
        }

        return [
            new ExpressionStatement(null, new CallExpression(null, new Identifier(null, variable), args)),
        ];
    }

    /**
     * @inheritdoc
     */
    get priority() {
        return 20;
    }

    /**
     * Gets the callback expression.
     *
     * @returns {Jymfony.Component.Autoloader.Parser.AST.Function}
     */
    get callback() {
        return new ArrowFunctionExpression(null, this.args[0]);
    }

    /**
     * @inheritdoc
     */
    compile(compiler, class_, target) {
        const variableName = compiler.generateVariableName();
        compiler.compileNode(new VariableDeclaration(null, 'const', [
            new VariableDeclarator(null,
                new Identifier(null, variableName),
                this.args[0]
            ),
        ]));
        compiler._emit(';\n');

        return this.apply(compiler, class_, target, variableName);
    }
}

module.exports = RegisterDecorator;
