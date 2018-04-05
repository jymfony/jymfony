const ArrayNode = Jymfony.Component.Config.Definition.ArrayNode;
const PrototypedArrayNode = Jymfony.Component.Config.Definition.PrototypedArrayNode;
const NodeDefinition = Jymfony.Component.Config.Definition.Builder.NodeDefinition;
const NodeBuilder = Jymfony.Component.Config.Definition.Builder.NodeBuilder;
const ParentNodeDefinitionInterface = Jymfony.Component.Config.Definition.Builder.ParentNodeDefinitionInterface;
const InvalidDefinitionException = Jymfony.Component.Config.Definition.Exception.InvalidDefinitionException;

/**
 * @memberOf Jymfony.Component.Config.Definition.Builder
 */
class ArrayNodeDefinition extends mix(NodeDefinition, ParentNodeDefinitionInterface) {
    __construct(name, parent = undefined) {
        super.__construct(name, parent);

        this._nullEquivalent = {};
        this._trueEquivalent = {};

        /**
         * @type {boolean}
         * @protected
         */
        this._performDeepMerging = true;

        /**
         * @type {boolean}
         * @protected
         */
        this._ignoreExtraKeys = false;

        /**
         * @type {boolean}
         * @protected
         */
        this._removeExtraKeys = true;

        /**
         * @type {Object}
         * @protected
         */
        this._children = {};

        /**
         * @type {Jymfony.Component.Config.Definition.Builder.NodeDefinition}
         * @protected
         */
        this._prototype = undefined;

        /**
         * @type {boolean}
         * @protected
         */
        this._atLeastOne = false;

        /**
         * @type {boolean}
         * @protected
         */
        this._allowNewKeys = true;

        /**
         * @type {string}
         * @private
         */
        this._key = undefined;

        /**
         * @type {boolean}
         * @private
         */
        this._removeKeyItem = undefined;

        /**
         * @type {boolean}
         * @protected
         */
        this._addDefaults = false;

        /**
         * @type {boolean}
         * @protected
         */
        this._addDefaultChildren = false;

        /**
         * @type {Jymfony.Component.Config.Definition.Builder.NodeBuilder}
         * @protected
         */
        this._nodeBuilder = undefined;

        /**
         * @type {boolean}
         * @private
         */
        this._normalizeKeys = true;
    }

    /**
     * Sets a custom children builder.
     *
     * @param {Jymfony.Component.Config.Definition.Builder.NodeBuilder} builder
     */
    setBuilder(builder) {
        this._nodeBuilder = builder;
    }

    /**
     * Returns a builder to add children nodes.
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.NodeBuilder}
     */
    children() {
        return this.getNodeBuilder();
    }

    /**
     * Sets a prototype for child nodes.
     *
     * @param {string} type The type of node
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.NodeDefinition}
     */
    prototype(type) {
        return this._prototype = this.getNodeBuilder().node(undefined, type).setParent(this);
    }

    /**
     * @returns {Jymfony.Component.Config.Definition.Builder.VariableNodeDefinition}
     */
    variablePrototype() {
        return this.prototype('variable');
    }

    /**
     * @returns {Jymfony.Component.Config.Definition.Builder.ScalarNodeDefinition}
     */
    scalarPrototype() {
        return this.prototype('scalar');
    }

    /**
     * @returns {Jymfony.Component.Config.Definition.Builder.BooleanNodeDefinition}
     */
    booleanPrototype() {
        return this.prototype('boolean');
    }

    /**
     * @returns {Jymfony.Component.Config.Definition.Builder.IntegerNodeDefinition}
     */
    integerPrototype() {
        return this.prototype('integer');
    }

    /**
     * @returns {Jymfony.Component.Config.Definition.Builder.FloatNodeDefinition}
     */
    floatPrototype() {
        return this.prototype('float');
    }

    /**
     * @returns {Jymfony.Component.Config.Definition.Builder.ArrayNodeDefinition}
     */
    arrayPrototype() {
        return this.prototype('array');
    }

    /**
     * @returns {Jymfony.Component.Config.Definition.Builder.EnumNodeDefinition}
     */
    enumPrototype() {
        return this.prototype('enum');
    }

    /**
     * Adds the default value if the node is not set in the configuration.
     *
     * This method is applicable to concrete nodes only (not to prototype nodes).
     * If this function has been called and the node is not set during the finalization
     * phase, it's default value will be derived from its children default values.
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.ArrayNodeDefinition}
     */
    addDefaultsIfNotSet() {
        this._addDefaults = true;

        return this;
    }

    /**
     * Adds children with a default value when none are defined.
     *
     * This method is applicable to prototype nodes only.
     *
     * @param {int|string|[string]|null|undefined} children The number of children|The child name|The children names to be added
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.ArrayNodeDefinition}
     */
    addDefaultChildrenIfNoneSet(children = undefined) {
        this._addDefaultChildren = children;

        return this;
    }

    /**
     * Requires the node to have at least one element.
     * This method is applicable to prototype nodes only.
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.ArrayNodeDefinition}
     */
    requiresAtLeastOneElement() {
        this._atLeastOne = true;

        return this;
    }

    /**
     * Disallows adding news keys in a subsequent configuration.
     * If used all keys have to be defined in the same configuration file.
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.ArrayNodeDefinition}
     */
    disallowNewKeysInSubsequentConfigs() {
        this._allowNewKeys = false;

        return this;
    }

    /**
     * Sets the attribute which value is to be used as key.
     *
     * This is useful when you have an indexed array that should be an
     * object. You can select an item from within the array
     * to be the key of the particular item. For example, if "id" is the
     * "key", then:
     *
     *     [
     *         {id: "my_name", foo: "bar"},
     *     ];
     *
     *   becomes
     *
     *     {
     *         "my_name": {foo: "bar"},
     *     };
     *
     * If you'd like "'id': 'my_name'" to still be present in the result,
     * then you can set the second argument of this method to false.
     *
     * This method is applicable to prototype nodes only.
     *
     * @param {string} name The name of the key
     * @param {boolean} removeKeyItem Whether or not the key item should be removed
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.ArrayNodeDefinition}
     */
    useAttributeAsKey(name, removeKeyItem = true) {
        this._key = name;
        this._removeKeyItem = removeKeyItem;

        return this;
    }

    /**
     * Sets whether the node can be unset.
     *
     * @param {boolean} allow
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.ArrayNodeDefinition}
     */
    canBeUnset(allow = true) {
        this.merge().allowUnset(allow);

        return this;
    }

    /**
     * Adds an "enabled" boolean to enable the current section.
     *
     * By default, the section is disabled. If any configuration is specified then
     * the node will be automatically enabled:
     *
     * enableableArrayNode: {enabled: true, ...}   # The config is enabled & default values get overridden
     * enableableArrayNode: ~                      # The config is enabled & use the default values
     * enableableArrayNode: true                   # The config is enabled & use the default values
     * enableableArrayNode: {other: value, ...}    # The config is enabled & default values get overridden
     * enableableArrayNode: {enabled: false, ...}  # The config is disabled
     * enableableArrayNode: false                  # The config is disabled
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.ArrayNodeDefinition}
     */
    canBeEnabled() { /* eslint-disable indent */
        this
            .addDefaultsIfNotSet()
            .treatFalseLike({ enabled: false })
            .treatTrueLike({ enabled: true })
            .treatNullLike({ enabled: true })
            .beforeNormalization()
                .ifArray()
                .then((v) => {
                    v.enabled = undefined === v.enabled ? true : v.enabled;

                    return v;
                })
            .end()
            .children()
                .booleanNode('enabled').defaultFalse()
        ;

        return this;
    } /* eslint-enable indent */

    /**
     * Adds an "enabled" boolean to enable the current section.
     * By default, the section is enabled.
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.ArrayNodeDefinition}
     */
    canBeDisabled() { /* eslint-disable indent */
        this
            .addDefaultsIfNotSet()
            .treatFalseLike({ enabled: false })
            .treatTrueLike({ enabled: true })
            .treatNullLike({ enabled: true })
            .children()
                .booleanNode('enabled').defaultTrue()
        ;

        return this;
    } /* eslint-enable indent */

    /**
     * Disables the deep merging of the node.
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.ArrayNodeDefinition}
     */
    performNoDeepMerging() {
        this._performDeepMerging = false;

        return this;
    }

    /**
     * Allows extra config keys to be specified under an array without
     * throwing an exception.
     *
     * Those config values are simply ignored and removed from the
     * resulting array. This should be used only in special cases where
     * you want to send an entire configuration array through a special
     * tree that processes only part of the array.
     *
     * @param {boolean} remove Whether to remove the extra keys
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.ArrayNodeDefinition}
     */
    ignoreExtraKeys(remove = true) {
        this._ignoreExtraKeys = true;
        this._removeExtraKeys = remove;

        return this;
    }

    /**
     * Sets key normalization.
     *
     * @param {boolean} bool Whether to enable key normalization
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.ArrayNodeDefinition}
     */
    normalizeKeys(bool) {
        this._normalizeKeys = !! bool;

        return this;
    }

    /**
     * Appends a node definition.
     *
     *     $node = new ArrayNodeDefinition()
     *         .children()
     *             .scalarNode('foo').end()
     *             .scalarNode('baz').end()
     *         .end()
     *         .append(this.getBarNodeDefinition())
     *     ;
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.ArrayNodeDefinition}
     */
    append(node) {
        this._children[node._name] = node.setParent(this);

        return this;
    }

    /**
     * Returns a node builder to be used to add children and prototype.
     *
     * @returns {Jymfony.Component.Config.Definition.Builder.NodeBuilder} The node builder
     */
    getNodeBuilder() {
        if (undefined === this._nodeBuilder) {
            this._nodeBuilder = new NodeBuilder();
        }

        return this._nodeBuilder.setParent(this);
    }

    /**
     * @inheritDoc
     */
    createNode() {
        let node;
        if (undefined === this._prototype) {
            node = new ArrayNode(this._name, this._parent);
            this.validateConcreteNode(node);
            node.setAddIfNotSet(this._addDefaults);

            for (const child of Object.values(this._children)) {
                child._parent = node;
                node.addChild(child.getNode());
            }
        } else {
            node = new PrototypedArrayNode(this._name, this._parent);
            this.validatePrototypeNode(node);

            if (undefined !== this._key) {
                node.setKeyAttribute(this._key, this._removeKeyItem);
            }

            if (true === this._atLeastOne || false === this._allowEmptyValue) {
                node.setMinNumberOfElements(1);
            }

            if (this._isDefault) {
                node.setDefaultValue(this._default);
            }

            if (false !== this._addDefaultChildren) {
                node.setAddChildrenIfNoneSet(this._addDefaultChildren);
                if (this._prototype instanceof ArrayNodeDefinition && undefined === this._prototype._prototype) {
                    this._prototype.addDefaultsIfNotSet();
                }
            }

            this._prototype._parent = node;
            node.setPrototype(this._prototype.getNode());
        }

        node.setAllowNewKeys(this._allowNewKeys);
        node.addEquivalentValue(null, this._nullEquivalent);
        node.addEquivalentValue(true, this._trueEquivalent);
        node.addEquivalentValue(false, this._falseEquivalent);
        node.setPerformDeepMerging(this._performDeepMerging);
        node.setRequired(this._required);
        node.setDeprecated(this._deprecationMessage);
        node.setIgnoreExtraKeys(this._ignoreExtraKeys, this._removeExtraKeys);
        node.setNormalizeKeys(this._normalizeKeys);

        if (undefined !== this._normalization) {
            node.setNormalizationClosures(this._normalization.$before);
        }

        if (undefined !== this._merge) {
            node.setAllowOverwrite(this._merge.allowOverwrite);
            node.setAllowFalse(this._merge.allowFalse);
        }

        if (undefined !== this._validation) {
            node.setFinalValidationClosures(this._validation.rules);
        }

        return node;
    }

    /**
     * Validate the configuration of a concrete node.
     *
     * @throws {Jymfony.Component.Config.Definition.Exception.InvalidDefinitionException}
     */
    validateConcreteNode(node) {
        const path = node.getPath();

        if (undefined !== this._key) {
            throw new InvalidDefinitionException(
                __jymfony.sprintf('useAttributeAsKey() is not applicable to concrete nodes at path "%s"', path)
            );
        }

        if (false === this._allowEmptyValue) {
            throw new InvalidDefinitionException(__jymfony.sprintf('cannotBeEmpty() is not applicable to concrete nodes at path "%s"', path));
        }

        if (true === this._atLeastOne) {
            throw new InvalidDefinitionException(
                __jymfony.sprintf('requiresAtLeastOneElement() is not applicable to concrete nodes at path "%s"', path)
            );
        }

        if (this._default) {
            throw new InvalidDefinitionException(
                __jymfony.sprintf('defaultValue() is not applicable to concrete nodes at path "%s"', path)
            );
        }

        if (false !== this._addDefaultChildren) {
            throw new InvalidDefinitionException(
                __jymfony.sprintf('addDefaultChildrenIfNoneSet() is not applicable to concrete nodes at path "%s"', path)
            );
        }
    }


    /**
     * Validate the configuration of a prototype node.
     *
     * @throws {Jymfony.Component.Config.Definition.Exception.InvalidDefinitionException}
     */
    validatePrototypeNode(node) {
        const path = node.getPath();

        if (this._addDefaults) {
            throw new InvalidDefinitionException(
                __jymfony.sprintf('->addDefaultsIfNotSet() is not applicable to prototype nodes at path "%s"', path)
            );
        }

        if (false !== this._addDefaultChildren) {
            if (this._isDefault) {
                throw new InvalidDefinitionException(
                    __jymfony.sprintf('A default value and default children might not be used together at path "%s"', path)
                );
            }

            if (undefined !== this._key && (undefined === this._addDefaultChildren || isNumber(this._addDefaultChildren) && 0 < this._addDefaultChildren)) {
                throw new InvalidDefinitionException(
                    __jymfony.sprintf('->addDefaultChildrenIfNoneSet() should set default children names as ->useAttributeAsKey() is used at path "%s"', path)
                );
            }

            if (undefined === this._key && (isString(this._addDefaultChildren) || isArray(this._addDefaultChildren) || isObjectLiteral(this._addDefaultChildren))) {
                throw new InvalidDefinitionException(
                    __jymfony.sprintf('->addDefaultChildrenIfNoneSet() might not set default children names as ->useAttributeAsKey() is not used at path "%s"', path)
                );
            }
        }
    }
}

module.exports = ArrayNodeDefinition;
