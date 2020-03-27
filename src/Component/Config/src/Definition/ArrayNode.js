const BaseNode = Jymfony.Component.Config.Definition.BaseNode;
const InvalidConfigurationException = Jymfony.Component.Config.Definition.Exception.InvalidConfigurationException;
const InvalidTypeException = Jymfony.Component.Config.Definition.Exception.InvalidTypeException;
const UnsetKeyException = Jymfony.Component.Config.Definition.Exception.UnsetKeyException;

/**
 * @memberOf Jymfony.Component.Config.Definition
 */
export default class ArrayNode extends BaseNode {
    /**
     * @inheritdoc
     */
    __construct(name, parent = undefined) {
        super.__construct(name, parent);

        /**
         * @type {Object}
         *
         * @protected
         */
        this._children = {};

        /**
         * @type {boolean}
         *
         * @protected
         */
        this._allowFalse = false;

        /**
         * @type {boolean}
         *
         * @protected
         */
        this._allowNewKeys = true;

        /**
         * @type {boolean}
         *
         * @protected
         */
        this._addIfNotSet = false;

        /**
         * @type {boolean}
         *
         * @protected
         */
        this._performDeepMerging = false;

        /**
         * @type {boolean}
         *
         * @protected
         */
        this._ignoreExtraKeys = false;

        /**
         * @type {boolean}
         *
         * @protected
         */
        this._removeExtraKeys = false;

        /**
         * @type {boolean}
         *
         * @protected
         */
        this._normalizeKeys = false;
    }

    /**
     * @param {boolean} normalizeKeys
     */
    setNormalizeKeys(normalizeKeys) {
        this._normalizeKeys = !! normalizeKeys;
    }

    /**
     * Normalizes keys between the different configuration formats.
     *
     * Namely, you mostly have foo_bar in YAML while you have foo-bar in XML.
     * After running this method, all keys are normalized to foo_bar.
     *
     * If you have a mixed key like foo-bar_moo, it will not be altered.
     * The key will also not be altered if the target key already exists.
     *
     * @param {*} value
     *
     * @returns {Object} The value with normalized keys
     *
     * @protected
     */
    _preNormalize(value) {
        if (! this._normalizeKeys || ! isObjectLiteral(value)) {
            return value;
        }

        const normalized = {};
        let normalizedKey;

        for (const [ k, v ] of __jymfony.getEntries(value)) {
            if (-1 !== k.indexOf('-') && -1 === k.indexOf('_') && ! value.hasOwnProperty(normalizedKey = k.replace(/-/g, '_'))) {
                normalized[normalizedKey] = v;
            } else {
                normalized[k] = v;
            }
        }

        return normalized;
    }

    /**
     * Retrieves the children of this node.
     *
     * @returns {Object} The children
     */
    getChildren() {
        return Object.assign({}, this._children);
    }

    /**
     * Sets whether to add default values for this array if it has not been
     * defined in any of the configuration files.
     *
     * @param {boolean} bool
     */
    setAddIfNotSet(bool) {
        this._addIfNotSet = !! bool;
    }

    /**
     * Sets whether false is allowed as value indicating that the array should be unset.
     *
     * @param {boolean} allow
     */
    setAllowFalse(allow) {
        this._allowFalse = !! allow;
    }

    /**
     * Sets whether new keys can be defined in subsequent configurations.
     *
     * @param {boolean} allow
     */
    setAllowNewKeys(allow) {
        this._allowNewKeys = !! allow;
    }

    /**
     * Sets if deep merging should occur.
     *
     * @param {boolean} bool
     */
    setPerformDeepMerging(bool) {
        this._performDeepMerging = !! bool;
    }

    /**
     * Whether extra keys should just be ignore without an exception.
     *
     * @param {boolean} bool To allow extra keys
     * @param {boolean} [remove = true] To remove extra keys
     */
    setIgnoreExtraKeys(bool, remove = true) {
        this._ignoreExtraKeys = !! bool;
        this._removeExtraKeys = this._ignoreExtraKeys && remove;
    }

    /**
     * Sets the node Name.
     *
     * @param {string} name The node's name
     */
    setName(name) {
        this._name = name;
    }

    /**
     * Checks if the node has a default value.
     *
     * @returns {boolean}
     */
    hasDefaultValue() {
        return this._addIfNotSet;
    }

    /**
     * Retrieves the default value.
     *
     * @returns {*} The default value
     *
     * @throws {RuntimeException} if the node has no default value
     */
    getDefaultValue() {
        if (! this.hasDefaultValue()) {
            throw new RuntimeException(__jymfony.sprintf('The node at path "%s" has no default value.', this.getPath()));
        }

        const defaults = {};
        for (const [ name, child ] of __jymfony.getEntries(this._children)) {
            if (child.hasDefaultValue()) {
                defaults[name] = child.getDefaultValue();
            }
        }

        return defaults;
    }

    /**
     * Adds a child node.
     *
     * @param {Jymfony.Component.Config.Definition.NodeInterface} node
     *
     * @throws {InvalidArgumentException} when the child node has no name or is not unique
     */
    addChild(node) {
        const name = node.getName();
        if (0 === name.length) {
            throw new InvalidArgumentException('Child nodes must be named.');
        }

        if (undefined !== this._children[name]) {
            throw new InvalidArgumentException(__jymfony.sprintf('A child node named "%s" already exists.', name));
        }

        this._children[name] = node;
    }

    /**
     * Finalizes the value of this node.
     *
     * @param {*} value
     *
     * @returns {*} The finalised value
     *
     * @throws {Jymfony.Component.Config.Definition.Exception.UnsetKeyException}
     * @throws {Jymfony.Component.Config.Definition.Exception.InvalidConfigurationException} if the node doesn't have enough _children
     */
    finalizeValue(value) {
        if (false === value) {
            throw new UnsetKeyException(__jymfony.sprintf('Unsetting key for path "%s", value: %s', this.getPath(), JSON.stringify(value)));
        }

        for (const [ name, child ] of __jymfony.getEntries(this._children)) {
            if (! value.hasOwnProperty(name)) {
                if (child.isRequired()) {
                    const ex = new InvalidConfigurationException(__jymfony.sprintf('The child node "%s" at path "%s" must be configured.', name, this.getPath()));
                    ex.setPath(this.getPath());

                    throw ex;
                }

                if (child.hasDefaultValue()) {
                    value[name] = child.getDefaultValue();
                }

                continue;
            }

            if (child.isDeprecated()) {
                __jymfony.trigger_deprecated(child.getDeprecationMessage(name, this.getPath()));
            }

            try {
                value[name] = child.finalize(value[name]);
            } catch (e) {
                if (e instanceof UnsetKeyException) {
                    delete value[name];
                } else {
                    throw e;
                }
            }
        }

        return value;
    }

    /**
     * @inheritdoc
     */
    validateType(value) {
        if ((! isArray(value) && ! isObjectLiteral(value)) && (! this._allowFalse || false !== value)) {
            const ex = new InvalidTypeException(__jymfony.sprintf('Invalid type for path "%s". Expected array, but got %s', this.getPath(), typeof value));
            const hint = this.getInfo();
            if (hint) {
                ex.addHint(hint);
            }

            ex.setPath(this.getPath());
            throw ex;
        }
    }

    /**
     * Normalizes the value.
     *
     * @param {*} value The value to normalize
     *
     * @returns {*} The normalized value
     *
     * @throws {Jymfony.Component.Config.Definition.Exception.InvalidConfigurationException}
     */
    normalizeValue(value) {
        if (false === value) {
            return value;
        }

        const normalized = new HashTable();
        value = HashTable.fromObject(value);

        for (const [ name, val ] of value) {
            if (undefined !== this._children[name]) {
                normalized.put(name, this._children[name].normalize(val));
                value.remove(name);
            } else if (! this._removeExtraKeys) {
                normalized.put(name, val);
            }
        }

        // If extra fields are present, throw exception
        if (value.length && ! this._ignoreExtraKeys) {
            const ex = new InvalidConfigurationException(
                __jymfony.sprintf('Unrecognized option%s "%s" under "%s"', 1 === value.length ? '' : 's', value.keys().join(', '), this.getPath())
            );
            ex.setPath(this.getPath());

            throw ex;
        }

        return normalized.toObject();
    }

    /**
     * Merges values together.
     *
     * @param {*} leftSide  The left side to merge
     * @param {*} rightSide The right side to merge
     *
     * @returns {*} The merged values
     *
     * @throws {Jymfony.Component.Config.Definition.Exception.InvalidConfigurationException}
     * @throws {RuntimeException}
     */
    mergeValues(leftSide, rightSide) {
        if (false === rightSide) {
            // If this is still false after the last config has been merged the
            // Finalization pass will take care of removing this key entirely
            return false;
        }

        if (false === leftSide || ! this._performDeepMerging) {
            return rightSide;
        }

        for (const [ k, v ] of __jymfony.getEntries(rightSide)) {
            // No conflict
            if (! leftSide.hasOwnProperty(k)) {
                if (! this._allowNewKeys) {
                    const ex = new InvalidConfigurationException(__jymfony.sprintf(
                        'You are not allowed to define new elements for path "%s". ' +
                        'Please define all elements for this path in one config file. ' +
                        'If you are trying to overwrite an element, make sure you redefine it ' +
                        'with the same name.',
                        this.getPath()
                    ));
                    ex.setPath(this.getPath());

                    throw ex;
                }

                leftSide[k] = v;
                continue;
            }

            if (undefined === this._children[k]) {
                throw new RuntimeException('merge() expects a normalized config array.');
            }

            leftSide[k] = this._children[k].merge(leftSide[k], v);
        }

        return leftSide;
    }
}
