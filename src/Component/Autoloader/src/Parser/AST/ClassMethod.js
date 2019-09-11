const ClassMemberInterface = require('./ClassMemberInterface');
const Function = require('./Function');
const Identifier = require('./Identifier');
const StringLiteral = require('./StringLiteral');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class ClassMethod extends mix(Function, ClassMemberInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.SourceLocation} location
     * @param {Jymfony.Component.Autoloader.Parser.AST.BlockStatement} body
     * @param {Jymfony.Component.Autoloader.Parser.AST.Identifier} id
     * @param {string} kind
     * @param {Jymfony.Component.Autoloader.Parser.AST.PatternInterface[]} [params = []]
     * @param {boolean} [generator = false]
     * @param {boolean} [async = false]
     * @param {boolean} [Static = false]
     */
    __construct(location, body, id, kind, params = [], { generator = false, async = false, Static = false } = {}) {
        super.__construct(location, body, id, params, { generator, async });

        /**
         * @type {string}
         *
         * @private
         */
        this._kind = kind;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._static = Static;

        /**
         * @type {null|string}
         */
        this.docblock = null;
    }

    /**
     * Gets the identifier.
     *
     * @returns {*}
     */
    get id() {
        return this._id;
    }

    /**
     * Gets the identifier.
     *
     * @returns {string}
     */
    get kind() {
        return this._kind;
    }

    /**
     * Whether this method is static.
     *
     * @returns {boolean}
     */
    get static() {
        return this._static;
    }

    /**
     * @inheritdoc
     */
    compileDecorators(compiler, target, id) {
        const key = this._id instanceof Identifier ? new StringLiteral(null, JSON.stringify(this._id.name)) : this._id;

        const tail = [];
        for (const decorator of this.decorators || []) {
            tail.push(...decorator.compile(compiler, target, [ id, key ]));
        }

        return tail;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        if (this._static) {
            compiler._emit('static ');
        }

        if (this._async) {
            compiler._emit('async ');
        }

        if (this._generator) {
            compiler._emit('* ');
        }

        if ('constructor' !== this._kind && 'method' !== this._kind) {
            compiler._emit(this._kind + ' ');
        }

        if (this._id instanceof Identifier) {
            compiler.compileNode(this._id);
        } else {
            compiler._emit('[');
            compiler.compileNode(this._id);
            compiler._emit(']');
        }

        Function.compileParams(compiler, this._params);
        compiler._emit(' ');
        compiler.compileNode(this._body);
    }
}

module.exports = ClassMethod;
