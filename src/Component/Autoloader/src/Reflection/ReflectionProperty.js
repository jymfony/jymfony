/**
 * Reflection utility for class getters/setters.
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
        const descriptor = reflectionClass.getPropertyDescriptor(propertyName);

        /**
         * @type {ReflectionClass}
         *
         * @private
         */
        this._class = new ReflectionClass(descriptor.ownClass);

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

        if (ReflectionProperty.KIND_GET === kind && this._class.hasReadableProperty(propertyName)) {
            this._method = descriptor.get;
        } else if (ReflectionProperty.KIND_SET === kind && this._class.hasWritableProperty(propertyName)) {
            this._method = descriptor.set;
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
     * Invokes the getter/setter method.
     *
     * @param {*} object
     * @param {*[]} args
     *
     * @returns {*}
     */
    invoke(object, ...args) {
        return this._method.call(object, ...args);
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
     * Gets the class metadata.
     *
     * @returns {[Function, *][]}
     */
    get metadata() {
        return MetadataStorage.getMetadata(this._class.getConstructor(), this._name);
    }
}

ReflectionProperty.KIND_GET = 'get';
ReflectionProperty.KIND_SET = 'set';

module.exports = global.ReflectionProperty = ReflectionProperty;
