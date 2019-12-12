const Class = require('./Class');
const DeclarationInterface = require('./DeclarationInterface');
const Function = require('./Function');

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
        let tail = [];
        if (1 === this._declarators.length) {
            const declarator = this._declarators[0];
            const init = declarator.init;
            if (init instanceof Class) {
                tail = init.compileDecorators(compiler);
            }
        }

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
            const init = declarator.init;
            if (init instanceof Function || init instanceof Class) {
                init.compileDocblock(compiler, declarator.id);
            }
        }

        for (const statement of tail) {
            compiler.compileNode(statement);
            compiler._emit(';\n');
        }
    }
}

module.exports = VariableDeclaration;
