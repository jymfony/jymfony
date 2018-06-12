/**
 * Reflection utility for class method.
 */
class ReflectionMethod {
    /**
     * Constructor.
     *
     * @param {ReflectionClass} reflectionClass
     * @param {string} methodName
     */
    constructor(reflectionClass, methodName) {
        /**
         * @type {ReflectionClass}
         *
         * @private
         */
        this._class = reflectionClass;

        /**
         * @type {string}
         *
         * @private
         */
        this._name = methodName;

        /**
         * @type {Function}
         *
         * @private
         */
        this._method = undefined;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._static = false;

        let method;
        if (method = reflectionClass._methods[methodName]) {
            this._method = method;
        } else if (method = reflectionClass._staticMethods[methodName]) {
            this._method = method;
            this._static = true;
        } else {
            throw new ReflectionException('Unknown method "' + methodName + '\'');
        }

        /**
         * @type {string}
         *
         * @private
         */
        this._type = isGeneratorFunction(this._method) ? ReflectionMethod.GENERATOR : ReflectionMethod.FUNCTION;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._async = isAsyncFunction(this._method);

        /**
         * @type {string}
         *
         * @private
         */
        this._docblock = reflectionClass._docblock ? reflectionClass._docblock.methods[(this._static ? 'static#' : '') + methodName] : undefined;
    }

    /**
     * Gets the reflection class.
     *
     * @returns {ReflectionClass}
     */
    get reflectionClass() {
        return this._class;
    }

    /**
     * Gets the method name.
     *
     * @returns {string}
     */
    get name() {
        return this._name;
    }

    /**
     * Gets if this method is static.
     *
     * @returns {boolean}
     */
    get isStatic() {
        return this._static;
    }

    /**
     * Gets if the function is a generator.
     *
     * @returns {boolean}
     */
    get isGenerator() {
        return this._type === ReflectionMethod.GENERATOR;
    }

    /**
     * Is this function async?
     *
     * @returns {boolean}
     */
    get isAsync() {
        return this._async;
    }

    /**
     * Docblock.
     *
     * @returns {string}
     */
    get docblock() {
        return this._docblock;
    }
}

ReflectionMethod.FUNCTION = 'function';
ReflectionMethod.ASYNC_FUNCTION = 'async function';
ReflectionMethod.GENERATOR = 'generator';

module.exports = ReflectionMethod;
