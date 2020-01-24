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
    getArgument(index) {
        if (this._arguments.has('index_' + index)) {
            return this._arguments.get('index_' + index);
        }

        return super.getArgument(index);
    }

    /**
     * @inheritdoc
     */
    replaceArgument(index, argument) {
        if (isNumber(index)) {
            this._arguments.put('index_' + index, argument);
        } else if (String(index).startsWith('$')) {
            this._arguments.put(index, argument);
        } else {
            throw new InvalidArgumentException('The argument must be an existing index or the name of a constructor\'s parameter.');
        }

        return this;
    }

    /**
     * @internal
     */
    setAutoconfigured() {
        throw new BadMethodCallException('A ChildDefinition cannot have instanceof conditionals set on it.');
    }

    /**
     * @internal
     */
    setInstanceofConditionals() {
        throw new BadMethodCallException('A ChildDefinition cannot have instanceof conditionals set on it.');
    }
}
