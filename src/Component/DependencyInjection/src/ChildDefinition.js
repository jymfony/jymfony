const Container = Jymfony.Component.DependencyInjection.Container;
const Definition = Jymfony.Component.DependencyInjection.Definition;

/**
 * @memberOf Jymfony.Component.DependencyInjection
 */
export default class ChildDefinition extends Definition {
    /**
     * Constructor.
     *
     * @param {*} parent
     */
    __construct(parent) {
        super.__construct();

        /**
         * @type {string}
         *
         * @private
         */
        this._parent = Container.normalizeId(parent);

        /**
         * @type {Object}
         *
         * @private
         */
        this._replacedArguments = {};
    }

    /**
     * Gets the extended definition.
     *
     * @returns {string}
     */
    getParent() {
        return this._parent;
    }

    /**
     * Sets the Definition to inherit from.
     *
     * @param {string|Function|symbol} parent
     */
    setParent(parent) {
        this._parent = Container.normalizeId(parent);

        return this;
    }

    /**
     * @inheritdoc
     */
    setArguments(args) {
        for (const [ k, v ] of __jymfony.getEntries(args)) {
            this.replaceArgument(k, v);
        }

        return this;
    }

    /**
     * @inheritdoc
     */
    getArguments() {
        const args = [ ...this._arguments ];
        for (const [ k, v ] of __jymfony.getEntries(this._replacedArguments)) {
            if (k >= args.length) {
                continue;
            }

            args[k] = v;
        }

        return __jymfony.deepClone(args);
    }

    /**
     * @inheritdoc
     */
    getArgument(index) {
        if (this._replacedArguments.hasOwnProperty(index)) {
            return this._replacedArguments(index);
        }

        return super.getArgument(index);
    }

    /**
     * @inheritdoc
     */
    replaceArgument(index, argument) {
        this._replacedArguments[index] = argument;

        return this;
    }

    /**
     * @internal
     */
    setInstanceofConditionals() {
        throw new BadMethodCallException('A ChildDefinition cannot have instanceof conditionals set on it.');
    }
}
