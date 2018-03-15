const NodeInterface = Jymfony.Component.Config.Definition.NodeInterface;
const ForbiddenOverwriteException = Jymfony.Component.Config.Definition.Exception.ForbiddenOverwriteException;

/**
 * The base node class.
 *
 * @memberOf Jymfony.Component.Config.Definition
 * @abstract
 */
class BaseNode extends implementationOf(NodeInterface) {
    /**
     * @throws \InvalidArgumentException if the name contains a period
     */
    __construct(name, parent = undefined) {
        if (-1 !== name.indexOf('.')) {
            throw new InvalidArgumentException('The name must not contain ".".');
        }

        /**
         * @type {string}
         * @protected
         */
        this._name = name;

        /**
         * @type {Jymfony.Component.Config.Definition.NodeInterface}
         * @protected
         */
        this._parent = parent;
        this._normalizationClosures = [];
        this._finalValidationClosures = [];
        this._allowOverwrite = true;
        this._required = false;
        this._deprecationMessage = undefined;
        this._equivalentValues = [];
        this._attributes = {};
    }

    setAttribute(key, value) {
        this._attributes[key] = value;
    }

    getAttribute(key, defaultValue = undefined) {
        return this._attributes[key] || defaultValue;
    }

    hasAttribute(key) {
        return undefined !== this._attributes[key];
    }

    getAttributes() {
        return this._attributes;
    }

    setAttributes(_attributes) {
        this._attributes = _attributes;
    }

    removeAttribute(key) {
        delete this._attributes[key];
    }

    /**
     * Sets an info message.
     *
     * @param {string} info
     */
    setInfo(info) {
        this.setAttribute('info', info);
    }

    /**
     * Returns info message.
     *
     * @returns {string} The info text
     */
    getInfo() {
        return this.getAttribute('info');
    }

    /**
     * Sets the example configuration for this node.
     *
     * @param {string|[string]} example
     */
    setExample(example) {
        this.setAttribute('example', example);
    }

    /**
     * Retrieves the example configuration for this node.
     *
     * @returns {string|[string]} The example
     */
    getExample() {
        return this.getAttribute('example');
    }

    /**
     * Adds an equivalent value.
     *
     * @param {*} originalValue
     * @param {*} equivalentValue
     */
    addEquivalentValue(originalValue, equivalentValue) {
        this._equivalentValues.push([ originalValue, equivalentValue ]);
    }

    /**
     * Set this node as _required.
     *
     * @param {boolean} bool Required node
     */
    setRequired(bool) {
        this._required = !! bool;
    }

    /**
     * Sets this node as deprecated.
     *
     * You can use %node% and %path% placeholders in your message to display,
     * respectively, the node name and its complete path.
     *
     * @param {string|undefined} message Deprecated message
     */
    setDeprecated(message) {
        this._deprecationMessage = message;
    }

    /**
     * Sets if this node can be overridden.
     *
     * @param {boolean} allow
     */
    setAllowOverwrite(allow) {
        this._allowOverwrite = !! allow;
    }

    /**
     * Sets the closures used for normalization.
     *
     * @param {[Function]} closures An array of Closures used for normalization
     */
    setNormalizationClosures(closures) {
        this._normalizationClosures = closures;
    }

    /**
     * Sets the closures used for final validation.
     *
     * @param {[Function]} closures An array of Closures used for final validation
     */
    setFinalValidationClosures(closures) {
        this._finalValidationClosures = closures;
    }

    /**
     * Checks if this node is _required.
     *
     * @returns {boolean}
     */
    isRequired() {
        return this._required;
    }

    /**
     * Checks if this node is deprecated.
     *
     * @returns {boolean}
     */
    isDeprecated() {
        return undefined !== this._deprecationMessage;
    }

    /**
     * Returns the deprecated message.
     *
     * @param {string} node the configuration node name
     * @param {string} path the path of the node
     *
     * @returns {string}
     */
    getDeprecationMessage(node, path) {
        return __jymfony.strtr(this._deprecationMessage, {'%node%': node, '%path%': path});
    }

    /**
     * Returns the name of this node.
     *
     * @returns {string} The Node's name
     */
    getName() {
        return this._name;
    }

    /**
     * Retrieves the path of this node.
     *
     * @returns {string} The Node's path
     */
    getPath() {
        let path = this._name;

        if (undefined !== this._parent) {
            path = this._parent.getPath() + '.' + path;
        }

        return path;
    }

    /**
     * Merges two values together.
     *
     * @param {*} leftSide
     * @param {*} rightSide
     *
     * @returns {*} The merged value
     *
     * @throws {Jymfony.Component.Config.Definition.Exception.ForbiddenOverwriteException}
     *
     * @final
     */
    merge(leftSide, rightSide) {
        if (! this._allowOverwrite) {
            throw new ForbiddenOverwriteException(__jymfony.sprintf(
                'Configuration path "%s" cannot be overwritten. You have to ' +
                'define all options for this path, and any of its sub-paths in ' +
                'one configuration section.',
                this.getPath()
            ));
        }

        this.validateType(leftSide);
        this.validateType(rightSide);

        return this.mergeValues(leftSide, rightSide);
    }

    /**
     * Normalizes a value, applying all normalization closures.
     *
     * @param {*} value Value to normalize
     *
     * @returns {*} The normalized value
     */
    normalize(value) {
        value = this._preNormalize(value);

        // Run custom normalization closures
        for (const closure of this._normalizationClosures) {
            value = closure(value);
        }

        // Replace value with their equivalent
        for (const data of this._equivalentValues) {
            if (data[0] === value) {
                value = data[1];
            }
        }

        // Validate type
        this.validateType(value);

        // Normalize value
        return this.normalizeValue(value);
    }

    /**
     * Normalizes the value before any other normalization is applied.
     *
     * @param {*} value
     *
     * @returns {*} The normalized array value
     */
    _preNormalize(value) {
        return value;
    }

    /**
     * Returns parent node for this node.
     *
     * @returns {Jymfony.Component.Config.Definition.NodeInterface|undefined}
     */
    getParent() {
        return this._parent;
    }

    /**
     * Finalizes a value, applying all finalization closures.
     *
     * @param {*} value The value to finalize
     *
     * @returns {*} The finalized value
     *
     * @throws {Exception}
     * @throws {Jymfony.Component.Config.Definition.Exception.InvalidConfigurationException}
     * 
     * @final
     */
    finalize(value) {
        this.validateType(value);

        value = this.finalizeValue(value);

        // Perform validation on the final value if a closure has been set.
        // The closure is also allowed to return another value.
        for (const closure of this._finalValidationClosures) {
            try {
                value = closure(value);
            } catch (e) {
                throw e;
                // Throw new InvalidConfigurationException(sprintf('Invalid configuration for path "%s": %s', this.getPath(), $e->getMessage()), $e->getCode(), $e);
            }
        }

        return value;
    }

    /**
     * Validates the type of a Node.
     *
     * @param {*} value The value to validate
     *
     * @throws {Jymfony.Component.Config.Definition.Exception.InvalidTypeException} when the value is invalid
     * @abstract
     */
    validateType(value) { // eslint-disable-line no-unused-vars
        throw new Error('validateType must be implemented');
    }

    /**
     * Normalizes the value.
     *
     * @param {*} value The value to normalize
     *
     * @return mixed The normalized value
     * @abstract
     */
    normalizeValue(value) { // eslint-disable-line no-unused-vars
        throw new Error('normalizeValue must be implemented');
    }

    /**
     * Merges two values together.
     *
     * @param {*} leftSide
     * @param {*} rightSide
     *
     * @returns {*} The merged value
     * @abstract
     */
    mergeValues(leftSide, rightSide) { // eslint-disable-line no-unused-vars
        throw new Error('mergeValues must be implemented');
    }

    /**
     * Finalizes a value.
     *
     * @param {*} value The value to finalize
     *
     * @returns {*} The finalized value
     * @abstract
     */
    finalizeValue(value) { // eslint-disable-line no-unused-vars
        throw new Error('finalizeValue must be implemented');
    }
}

module.exports = BaseNode;
