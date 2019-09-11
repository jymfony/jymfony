const NodeParentInterface = Jymfony.Component.Config.Definition.Builder.NodeParentInterface;
const ExprBuilder = Jymfony.Component.Config.Definition.Builder.ExprBuilder;
const MergeBuilder = Jymfony.Component.Config.Definition.Builder.MergeBuilder;
const NormalizationBuilder = Jymfony.Component.Config.Definition.Builder.NormalizationBuilder;
const ValidationBuilder = Jymfony.Component.Config.Definition.Builder.ValidationBuilder;

/**
 * This class provides a fluent interface for defining a node.
 *
 * @memberOf Jymfony.Component.Config.Definition.Builder
 * @abstract
 */
export default class NodeDefinition extends implementationOf(NodeParentInterface) {
    /**
     * Constructor.
     *
     * @param {string} name
     * @param {Jymfony.Component.Config.Definition.Builder.NodeParentInterface} [parent]
     */
    __construct(name, parent = undefined) {
        /**
         * @type {Jymfony.Component.Config.Definition.Builder.NodeParentInterface|undefined}
         *
         * @protected
         */
        this._parent = parent;

        /**
         * @type {string}
         *
         * @protected
         */
        this._name = name;

        /**
         * @type {Jymfony.Component.Config.Definition.Builder.NormalizationBuilder|undefined}
         *
         * @protected
         */
        this._normalization = undefined;

        /**
         * @type {Jymfony.Component.Config.Definition.Builder.ValidationBuilder|undefined}
         *
         * @protected
         */
        this._validation = undefined;

        /**
         * @type {*}
         *
         * @protected
         */
        this._default = undefined;

        /**
         * @type {boolean}
         *
         * @protected
         */
        this._isDefault = false;

        /**
         * @type {boolean}
         *
         * @protected
         */
        this._required = false;

        /**
         * @type {string|undefined}
         *
         * @protected
         */
        this._deprecationMessage = undefined;

        /**
         * @type {Jymfony.Component.Config.Definition.Builder.MergeBuilder|undefined}
         *
         * @protected
         */
        this._merge = undefined;

        /**
         * @type {boolean}
         *
         * @protected
         */
        this._allowEmptyValue = true;

        /**
         * @type {*}
         *
         * @protected
         */
        this._nullEquivalent = undefined;

        /**
         * @type {*}
         *
         * @protected
         */
        this._trueEquivalent = true;

        /**
         * @type {*}
         *
         * @protected
         */
        this._falseEquivalent = false;

        /**
         * @type {Object}
         *
         * @protected
         */
        this._attributes = {};
    }

    /**
     * Sets the parent node.
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.NodeDefinition}
     */
    setParent(parent) {
        this._parent = parent;

        return this;
    }

    /**
     * Sets info message.
     *
     * @param {string} info The info text
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.NodeDefinition}
     */
    info(info) {
        return this.attribute('info', info);
    }

    /**
     * Sets example configuration.
     *
     * @param {string|array|Object} example
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.NodeDefinition}
     */
    example(example) {
        return this.attribute('example', example);
    }

    /**
     * Sets an attribute on the node.
     *
     * @param {string} key
     * @param {*} value
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.NodeDefinition}
     */
    attribute(key, value) {
        this._attributes[key] = value;

        return this;
    }

    /**
     * Returns the parent node.
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.NodeParentInterface|undefined}
     */
    end() {
        return this._parent;
    }

    /**
     * Creates the node.
     *
     * @param {boolean} [forceRootNode = false] Whether to force this node as the root node
     *
     * @returns {Jymfony.Component.Config.Definition.NodeInterface}
     */
    getNode(forceRootNode = false) {
        if (forceRootNode) {
            this._parent = undefined;
        }

        if (undefined !== this._normalization) {
            this._normalization.$before = ExprBuilder.buildExpressions(this._normalization.$before);
        }

        if (undefined !== this._validation) {
            this._validation.rules = ExprBuilder.buildExpressions(this._validation.rules);
        }

        const node = this.createNode();
        node.setAttributes(this._attributes);

        return node;
    }

    /**
     * Sets the default value.
     *
     * @param {*} value The default value
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.NodeDefinition}
     */
    defaultValue(value) {
        this._isDefault = true;
        this._default = value;

        return this;
    }

    /**
     * Sets the node as required.
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.NodeDefinition}
     */
    isRequired() {
        this._required = true;

        return this;
    }

    /**
     * Sets the node as deprecated.
     *
     * You can use %node% and %path% placeholders in your message to display,
     * respectively, the node name and its complete path.
     *
     * @param {string} [message = 'The child node "%node%" at path "%path%" is deprecated.'] Deprecation message
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.NodeDefinition}
     */
    setDeprecated(message = 'The child node "%node%" at path "%path%" is deprecated.') {
        this._deprecationMessage = message;

        return this;
    }

    /**
     * Sets the equivalent value used when the node contains null.
     *
     * @param {*} value
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.NodeDefinition}
     */
    treatNullLike(value) {
        this._nullEquivalent = value;

        return this;
    }

    /**
     * Sets the equivalent value used when the node contains true.
     *
     * @param {*} value
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.NodeDefinition}
     */
    treatTrueLike(value) {
        this._trueEquivalent = value;

        return this;
    }

    /**
     * Sets the equivalent value used when the node contains false.
     *
     * @param {*} value
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.NodeDefinition}
     */
    treatFalseLike(value) {
        this._falseEquivalent = value;

        return this;
    }

    /**
     * Sets null as the default value.
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.NodeDefinition}
     */
    defaultNull() {
        return this.defaultValue(null);
    }

    /**
     * Sets undefined as the default value.
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.NodeDefinition}
     */
    defaultUndefined() {
        return this.defaultValue(undefined);
    }

    /**
     * Sets true as the default value.
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.NodeDefinition}
     */
    defaultTrue() {
        return this.defaultValue(true);
    }

    /**
     * Sets false as the default value.
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.NodeDefinition}
     */
    defaultFalse() {
        return this.defaultValue(false);
    }

    /**
     * Sets an expression to run before the normalization.
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.ExprBuilder}
     */
    beforeNormalization() {
        return this.normalization().before();
    }

    /**
     * Denies the node value being empty.
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.NodeDefinition}
     */
    cannotBeEmpty() {
        this._allowEmptyValue = false;

        return this;
    }

    /**
     * Sets an expression to run for the validation.
     *
     * The expression receives the value of the node and must return it. It can modify it.
     * An exception should be thrown when the node is not valid.
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.ExprBuilder}
     */
    validate() {
        return this.validation().rule();
    }

    /**
     * Sets whether the node can be overwritten.
     *
     * @param {boolean} [deny = true] Whether the overwriting is forbidden or not
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.NodeDefinition}
     */
    cannotBeOverwritten(deny = true) {
        this.merge().denyOverwrite(deny);

        return this;
    }

    /**
     * Gets the builder for validation rules.
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.ValidationBuilder}
     *
     * @protected
     */
    validation() {
        if (undefined === this._validation) {
            this._validation = new ValidationBuilder(this);
        }

        return this._validation;
    }

    /**
     * Gets the builder for merging rules.
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.MergeBuilder}
     *
     * @protected
     */
    merge() {
        if (undefined === this._merge) {
            this._merge = new MergeBuilder(this);
        }

        return this._merge;
    }

    /**
     * Gets the builder for normalization rules.
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.NormalizationBuilder}
     *
     * @protected
     */
    normalization() {
        if (undefined === this._normalization) {
            this._normalization = new NormalizationBuilder(this);
        }

        return this._normalization;
    }

    /**
     * Instantiate and configure the node according to this definition.
     *
     * @returns {Jymfony.Component.Config.Definition.NodeInterface}
     *
     * @throws {Jymfony.Component.Config.Exception.InvalidDefinitionException} When the definition is invalid
     *
     * @abstract
     *
     * @protected
     */
    createNode() {
        throw new Error('createNode method must be implemented');
    }
}
