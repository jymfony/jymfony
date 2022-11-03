/**
 * Reflection utility for method parameters.
 */
class ReflectionParameter {
    /**
     * Constructor.
     *
     * @param {ReflectionMethod} reflectionMethod
     * @param {null|string} name
     * @param {int} index
     * @param {*} defaultValue
     * @param {boolean} objectPattern
     * @param {boolean} arrayPattern
     * @param {boolean} restElement
     *
     * @internal
     */
    constructor(
        reflectionMethod,
        name,
        index,
        defaultValue = undefined,
        objectPattern = false,
        arrayPattern = false,
        restElement = false,
    ) {
        /**
         * @type {ReflectionMethod}
         *
         * @private
         */
        this._reflectionMethod = reflectionMethod;

        /**
         * @type {null|string}
         *
         * @private
         */
        this._name = name;

        /**
         * @type {int}
         *
         * @private
         */
        this._index = index;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._objectPattern = objectPattern;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._arrayPattern = arrayPattern;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._restElement = restElement;

        /**
         * @type {*}
         *
         * @private
         */
        this._defaultValue = defaultValue;

        if (isObject(defaultValue)) {
            Object.freeze(defaultValue);
        }
    }

    /**
     * Gets the reflection class.
     *
     * @returns {ReflectionClass}
     */
    get reflectionClass() {
        return this._reflectionMethod.reflectionClass;
    }

    /**
     * Gets the reflection method.
     *
     * @returns {ReflectionMethod}
     */
    get reflectionMethod() {
        return this._reflectionMethod;
    }

    /**
     * Gets the parameter name.
     *
     * @returns {string}
     */
    get name() {
        return this._name;
    }

    /**
     * Gets the parameter default value.
     *
     * @returns {*}
     */
    get defaultValue() {
        return this._defaultValue;
    }

    /**
     * Whether this parameter is an object pattern.
     *
     * @returns {boolean}
     */
    get isObjectPattern() {
        return this._objectPattern;
    }

    /**
     * Whether this parameter is an array pattern.
     *
     * @returns {boolean}
     */
    get isArrayPattern() {
        return this._arrayPattern;
    }

    /**
     * Whether this parameter is a rest element.
     *
     * @returns {boolean}
     */
    get isRestElement() {
        return this._restElement;
    }

    /**
     * Gets the metadata associated to this parameter.
     *
     * @returns {[Function, *][]}
     */
    get metadata() {
        return MetadataStorage.getMetadata(this._reflectionMethod._method[Symbol.metadata], this._index);
    }
}

module.exports = global.ReflectionParameter = ReflectionParameter;
