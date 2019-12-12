const ClassMemberInterface = require('./ClassMemberInterface');
const Identifier = require('./Identifier');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class ClassProperty extends implementationOf(ClassMemberInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.SourceLocation} location
     * @param {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface} key
     * @param {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface} value
     * @param {boolean} Static
     * @param {boolean} Private
     */
    __construct(location, key, value, Static, Private) {
        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.SourceLocation}
         */
        this.location = location;

        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface}
         *
         * @private
         */
        this._key = key;

        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface}
         *
         * @private
         */
        this._value = value;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._static = Static;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._private = Private;

        /**
         * @type {null|string}
         */
        this.docblock = null;

        /**
         * @type {null|Jymfony.Component.Autoloader.Parser.AST.AppliedDecorator[]}
         */
        this.decorators = null;
    }

    /**
     * Gets the key.
     *
     * @return {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface}
     */
    get key() {
        return this._key;
    }

    /**
     * Whether this property is static.
     *
     * @return {boolean}
     */
    get static() {
        return this._static;
    }

    /**
     * Whether this property is private.
     *
     * @return {boolean}
     */
    get private() {
        return this._private;
    }

    /**
     * Gets the initialization value.
     *
     * @returns {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface}
     */
    get value() {
        return this._value;
    }

    /**
     * Clears out the initialization value.
     */
    clearValue() {
        this._value = null;
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

    /**
     * @inheritdoc
     */
    compile(compiler) {
        if (this._static) {
            compiler._emit('static ');
        }

        if (this._private) {
            compiler._emit('#');
        }

        if (this._key instanceof Identifier) {
            compiler.compileNode(this._key);
        } else {
            compiler._emit('[');
            compiler.compileNode(this._key);
            compiler._emit(']');
        }

        if (null !== this._value) {
            compiler._emit(' = ');
            compiler.compileNode(this._value);
        }
    }
}

module.exports = ClassProperty;
