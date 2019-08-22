const ArrayNode = Jymfony.Component.Config.Definition.ArrayNode;
const Exception = Jymfony.Component.Config.Definition.Exception;

/**
 * Represents a prototyped Array node in the config tree.
 *
 * @memberOf Jymfony.Component.Config.Definition
 */
export default class PrototypedArrayNode extends ArrayNode {
    /**
     * @inheritdoc
     */
    __construct(name, parent = undefined) {
        super.__construct(name, parent);

        this._prototype = undefined;
        this._keyAttribute = undefined;
        this._removeKeyAttribute = false;
        this._minNumberOfElements = 0;
        this._defaultValue = {};
        this._defaultChildren = undefined;

        /**
         * @type {Object.<string, Jymfony.Component.Config.Definition.NodeInterface>}
         *
         * @private
         */
        this._valuePrototypes = {};
    }

    /**
     * Sets the minimum number of elements that a prototype based node must
     * contain. By default this is zero, meaning no elements.
     *
     * @param {int} number
     */
    setMinNumberOfElements(number) {
        this._minNumberOfElements = number;
    }

    /**
     * Sets the attribute which value is to be used as key.
     *
     * This is useful when you have an array that should be an object.
     * You can select an item from within the object to be the key of
     * the particular item. For example, if "id" is the "key", then:
     *
     *     [
     *         {id: "my_name", foo: "bar"},
     *     ];
     *
     *  becomes
     *
     *      {
     *          'my_name': {'foo': 'bar'},
     *      };
     *
     * If you'd like "'id': 'my_name'" to still be present in the resulting
     * array, then you can set the second argument of this method to false.
     *
     * @param {string} attribute The name of the attribute which value is to be used as a key
     * @param {boolean} remove Whether or not to remove the key
     */
    setKeyAttribute(attribute, remove = true) {
        this._keyAttribute = attribute;
        this._removeKeyAttribute = remove;
    }

    /**
     * Retrieves the name of the attribute which value should be used as key.
     *
     * @returns {string} The name of the attribute
     */
    getKeyAttribute() {
        return this._keyAttribute;
    }

    /**
     * Sets the default value of this node.
     *
     * @param {string} value
     *
     * @throws {InvalidArgumentException} if the default value is not an array
     */
    setDefaultValue(value) {
        if (! isArray(value) && ! isObjectLiteral(value)) {
            throw new InvalidArgumentException(this.getPath()+': the default value of an array node has to be an array.');
        }

        this._defaultValue = value;
    }

    /**
     * @inheritdoc
     */
    hasDefaultValue() {
        return true;
    }

    /**
     * Adds default children when none are set.
     *
     * @param {int|string|array|object|undefined} children The number of children|The child name|The children names to be added
     */
    setAddChildrenIfNoneSet(children = [ 'defaults' ]) {
        if (undefined === children) {
            this._defaultChildren = [ 'defaults' ];
        } else {
            this._defaultChildren = isNumber(children) && 0 < children ? Array.from(new Array(children), (x, i) => i + 1) : (isArray(children) ? children : [ children ]);
        }
    }

    /**
     * @inheritdoc
     *
     * The default value could be either explicited or derived from the prototype
     * default value.
     */
    getDefaultValue() {
        if (undefined !== this._defaultChildren) {
            const defaultValue = this._prototype.hasDefaultValue() ? this._prototype.getDefaultValue() : {};
            const defaults = new HashTable();
            for (const [ i, name ] of __jymfony.getEntries(Object.values(this._defaultChildren))) {
                defaults.put(undefined === this._keyAttribute ? i : name, defaultValue);
            }

            return defaults.toObject();
        }

        return this._defaultValue;
    }

    /**
     * Sets the node prototype.
     *
     * @param {Jymfony.Component.Config.Definition.NodeInterface} node
     */
    setPrototype(node) {
        this._prototype = node;
    }

    /**
     * Retrieves the prototype.
     *
     * @returns {Jymfony.Component.Config.Definition.NodeInterface} The prototype
     */
    getPrototype() {
        return this._prototype;
    }

    /**
     * Disable adding concrete children for prototyped nodes.
     *
     * @throws {Jymfony.Component.Config.Definition.Exception.Exception}
     */
    addChild(node) { // eslint-disable-line no-unused-vars
        throw new Exception.Exception('A prototyped array node can not have concrete children.');
    }

    /**
     * Finalizes the value of this node.
     *
     * @param {*} value
     *
     * @returns {*} The finalized value
     *
     * @throws {Jymfony.Component.Config.Definition.Exception.UnsetKeyException}
     * @throws {Jymfony.Component.Config.Definition.Exception.InvalidConfigurationException} if the node doesn't have enough children
     */
    finalizeValue(value) {
        if (false === value) {
            throw new Exception.UnsetKeyException(
                __jymfony.sprintf('Unsetting key for path "%s", value: %s', this.getPath(), JSON.stringify(value))
            );
        }

        for (const [ k, v ] of __jymfony.getEntries(value)) {
            const prototype = this._getPrototypeForChild(k);
            try {
                value[k] = prototype.finalize(v);
            } catch (e) {
                if (e instanceof Exception.UnsetKeyException) {
                    delete value[k];
                } else {
                    throw e;
                }
            }
        }

        if (value.length < this._minNumberOfElements) {
            const ex = new Exception.InvalidConfigurationException(
                __jymfony.sprintf('The path "%s" should have at least %d element(s) defined.', this.getPath(), this._minNumberOfElements)
            );
            ex.setPath(this.getPath());

            throw ex;
        }

        return value;
    }

    /**
     * Normalizes the value.
     *
     * @param {*} value The value to normalize
     *
     * @returns {*} The normalized value
     *
     * @throws {Jymfony.Component.Config.Definition.Exception.InvalidConfigurationException}
     * @throws {Jymfony.Component.Config.Definition.Exception.DuplicateKeyException}
     */
    normalizeValue(value) {
        if (false === value) {
            return value;
        }

        const isAssoc = isObjectLiteral(value);
        const normalized = new HashTable();
        for (let [ k, v ] of __jymfony.getEntries(value)) {
            if (undefined !== this._keyAttribute && (isArray(v) || isObjectLiteral(v))) {
                if (undefined === v[this._keyAttribute] && isNumber(k) && !isAssoc) {
                    const ex = new Exception.InvalidConfigurationException(
                        __jymfony.sprintf('The attribute "%s" must be set for path "%s".', this._keyAttribute, this.getPath())
                    );
                    ex.setPath(this.getPath());

                    throw ex;
                } else if (undefined !== v[this._keyAttribute]) {
                    k = v[this._keyAttribute];

                    // Remove the key attribute when required
                    if (this._removeKeyAttribute) {
                        delete v[this._keyAttribute];
                    }

                    // If only "value" is left
                    if (__jymfony.equal(Object.keys(v), [ 'value' ])) {
                        v = v['value'];
                        let children;
                        if (this._prototype instanceof ArrayNode && (children = this._prototype.getChildren()) && children.hasOwnProperty('value')) {
                            const valuePrototype = this._valuePrototypes[0] || __jymfony.clone(children.value);
                            valuePrototype._parent = this;
                            const originalClosures = this._prototype._normalizationClosures;
                            if (isArray(originalClosures)) {
                                const valuePrototypeClosures = valuePrototype._normalizationClosures;
                                valuePrototype._normalizationClosures = isArray(valuePrototypeClosures) ? [ ...originalClosures, ...valuePrototypeClosures ] : originalClosures;
                            }

                            this._valuePrototypes[k] = valuePrototype;
                        }
                    }
                }

                if (normalized.has(k)) {
                    const ex = new Exception.DuplicateKeyException(
                        __jymfony.sprintf('Duplicate key "%s" for path "%s".', k, this.getPath())
                    );
                    ex.setPath(this.getPath());

                    throw ex;
                }
            }

            const prototype = this._getPrototypeForChild(k);
            if (undefined !== this._keyAttribute || isAssoc) {
                normalized.put(k, prototype.normalize(v));
            } else {
                normalized.push(prototype.normalize(v));
            }
        }

        return normalized.toObject();
    }

    /**
     * @inheritdoc
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
            // Prototype, and key is irrelevant, so simply append the element
            if (undefined === this._keyAttribute) {
                leftSide.push(v);
                continue;
            }

            // No conflict
            if (! leftSide.hasOwnProperty(k)) {
                if (! this._allowNewKeys) {
                    const ex = new Exception.InvalidConfigurationException(__jymfony.sprintf(
                        'You are not allowed to define new elements for path "%s". Please define all elements for this path in one config file.',
                        this.getPath()
                    ));
                    ex.setPath(this.getPath());

                    throw ex;
                }

                leftSide[k] = v;
                continue;
            }

            const prototype = this._getPrototypeForChild(k);
            leftSide[k] = prototype.merge(leftSide[k], v);
        }

        return leftSide;
    }

    /**
     * Returns a prototype for the child node that is associated to key in the value array.
     * For general child nodes, this will be this._prototype.
     * But if this._removeKeyAttribute is true and there are only two keys in the child node:
     * one is same as this._keyAttribute and the other is 'value', then the prototype will be different.
     *
     * For example, assume this._keyAttribute is 'name' and the value array is as follows:
     * [
     *     {
     *         'name': 'name001',
     *         'value': 'value001'
     *     }
     * ]
     *
     * Now, the key is 0 and the child node is:
     * {
     *    'name': 'name001',
     *    'value': 'value001'
     * }
     *
     * When normalizing the value array, the 'name' element will removed from the child node
     * and its value becomes the new key of the child node:
     * {
     *     'name001': {'value' => 'value001'}
     * }
     *
     * Now only 'value' element is left in the child node which can be further simplified into a string:
     * {'name001': 'value001'}
     *
     * Now, the key becomes 'name001' and the child node becomes 'value001' and
     * the prototype of child node 'name001' should be a ScalarNode instead of an ArrayNode instance.
     *
     * @returns {*} The prototype instance
     */
    _getPrototypeForChild(key) {
        const prototype = this._valuePrototypes[key] || this._prototype;
        prototype.setName(key);

        return prototype;
    }
}
