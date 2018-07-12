const Definition = Jymfony.Component.DependencyInjection.Definition;

/**
 * @memberOf Jymfony.Component.DependencyInjection
 */
class ChildDefinition extends Definition {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.DependencyInjection.Definition} parent
     */
    __construct(parent) {
        super.__construct();

        /**
         * @type {Jymfony.Component.DependencyInjection.Definition}
         *
         * @private
         */
        this._parent = parent;

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
     * @returns {Jymfony.Component.DependencyInjection.Definition}
     */
    getParent() {
        return this._parent;
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
}

module.exports = ChildDefinition;
