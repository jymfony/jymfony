/**
 * Reflection utility for class method.
 */
class ReflectionProperty {
    /**
     * Constructor.
     *
     * @param {ReflectionClass} reflectionClass
     * @param {string} kind
     * @param {string} propertyName
     */
    constructor(reflectionClass, kind, propertyName) {
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
        this._name = propertyName;

        /**
         * @type {Function}
         *
         * @private
         */
        this._method = undefined;

        if (ReflectionProperty.KIND_GET === kind && reflectionClass.hasReadableProperty(propertyName)) {
            this._method = reflectionClass.getPropertyDescriptor(propertyName).get;
        } else if (ReflectionProperty.KIND_SET === kind && reflectionClass.hasWritableProperty(propertyName)) {
            this._method = reflectionClass.getPropertyDescriptor(propertyName).set;
        }

        if (undefined === this._method) {
            throw new ReflectionException('Property "' + propertyName + '" (' + kind + ') does not exist');
        }

        /**
         * @type {string}
         *
         * @private
         */
        this._docblock = this._method[Symbol.docblock];
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
     * Docblock.
     *
     * @returns {string}
     */
    get docblock() {
        return this._docblock;
    }

    /**
     * Gets the annotations for the current property getter/setter.
     *
     * @return {*[]}
     */
    get annotations() {
        return this._method[Symbol.annotations] || [];
    }
}

ReflectionProperty.KIND_GET = 'get';
ReflectionProperty.KIND_SET = 'set';

module.exports = global.ReflectionProperty = ReflectionProperty;
