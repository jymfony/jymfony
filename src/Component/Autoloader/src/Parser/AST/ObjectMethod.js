const Function = require('./Function');
const Identifier = require('./Identifier');
const ObjectMember = require('./ObjectMember');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class ObjectMethod extends mix(Function, ObjectMember) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.SourceLocation} location
     * @param {Jymfony.Component.Autoloader.Parser.AST.BlockStatement} body
     * @param {Jymfony.Component.Autoloader.Parser.AST.Identifier} id
     * @param {Jymfony.Component.Autoloader.Parser.AST.PatternInterface[]} params
     * @param {string} kind
     * @param {boolean} generator
     * @param {boolean} async
     */
    __construct(location, body, id, kind, params = [], { generator = false, async = false } = {}) {
        super.__construct(location, body, id, params, { generator, async });

        /**
         * @type {string}
         *
         * @private
         */
        this._kind = kind;

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
     * @inheritdoc
     */
    compile(compiler) {
        if (this._async) {
            compiler._emit('async ');
        }

        if (this._generator) {
            compiler._emit('* ');
        }

        if ('method' !== this._kind) {
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

module.exports = ObjectMethod;
