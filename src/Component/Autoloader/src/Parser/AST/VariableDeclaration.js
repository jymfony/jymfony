const AssignmentExpression = require('./AssignmentExpression');
const ClassExpression = require('./ClassExpression');
const DeclarationInterface = require('./DeclarationInterface');
const ExpressionStatement = require('./ExpressionStatement');
const FunctionExpression = require('./FunctionExpression');
const Identifier = require('./Identifier');
const MemberExpression = require('./MemberExpression');
const StringLiteral = require('./StringLiteral');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class VariableDeclaration extends implementationOf(DeclarationInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.SourceLocation} location
     * @param {"const"|"let"|"var"} kind
     * @param {Jymfony.Component.Autoloader.Parser.AST.VariableDeclarator[]} declarators
     */
    __construct(location, kind, declarators) {
        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.SourceLocation}
         */
        this.location = location;

        /**
         * @type {"const"|"let"|"var"}
         *
         * @private
         */
        this._kind = kind;

        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.VariableDeclarator[]}
         *
         * @private
         */
        this._declarators = declarators;

        /**
         * @type {null|string}
         */
        this.docblock = null;
    }

    /**
     * Gets the variable declarators.
     *
     * @return {Jymfony.Component.Autoloader.Parser.AST.VariableDeclarator[]}
     */
    get declarators() {
        return this._declarators;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler._emit(this._kind + ' ');

        for (const i in this._declarators) {
            compiler.compileNode(this._declarators[i]);

            if (i != this._declarators.length - 1) {
                compiler._emit(', ');
            }
        }

        if (!! this.docblock && 1 === this._declarators.length) {
            compiler._emit(';\n');

            const declarator = this._declarators[0];
            if (declarator.init instanceof FunctionExpression || declarator.init instanceof ClassExpression) {
                compiler.compileNode(new ExpressionStatement(null, new AssignmentExpression(
                    null,
                    '=',
                    new MemberExpression(
                        null,
                        declarator.id,
                        new MemberExpression(null, new Identifier(null, 'Symbol'), new Identifier(null, 'docblock'), false),
                        true,
                    ),
                    new StringLiteral(null, JSON.stringify(this.docblock))
                )));
                compiler._emit(';\n');
            }
        }
    }
}

module.exports = VariableDeclaration;
