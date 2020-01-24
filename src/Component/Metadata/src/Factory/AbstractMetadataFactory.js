const InvalidArgumentException = Jymfony.Contracts.Metadata.Exception.InvalidArgumentException;
const MetadataFactoryInterface = Jymfony.Contracts.Metadata.MetadataFactoryInterface;

/**
 * @memberOf Jymfony.Component.Metadata.Factory
 */
export default class AbstractMetadataFactory extends implementationOf(MetadataFactoryInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Metadata.Loader.LoaderInterface} loader
     */
    __construct(loader) {
        /**
         * @type {Jymfony.Component.Metadata.Loader.LoaderInterface}
         *
         * @private
         */
        this._loader = loader;

        /**
         * @type {Map<string, Jymfony.Component.Metadata.ClassMetadataInterface>}
         *
         * @private
         */
        this._loadedClasses = new Map();
    }

    /**
     * @inheritdoc
     */
    getMetadataFor(subject) {
        const Class = this._getClass(subject);
        if (false === Class) {
            throw InvalidArgumentException.create(InvalidArgumentException.VALUE_IS_NOT_AN_OBJECT, subject);
        }

        if (this._loadedClasses.has(Class)) {
            return this._loadedClasses.get(Class);
        }

        if (! ReflectionClass.exists(Class)) {
            throw InvalidArgumentException.create(InvalidArgumentException.CLASS_DOES_NOT_EXIST, Class);
        }

        const reflectionClass = new ReflectionClass(Class);
        const classMetadata = this._createMetadata(reflectionClass);
        if (! this._loader.loadClassMetadata(classMetadata)) {
            return classMetadata;
        }

        this._mergeSuperclasses(classMetadata);
        this._validate(classMetadata);

        this._loadedClasses.set(Class, classMetadata);
        return classMetadata;
    }

    /**
     * @inheritdoc
     */
    hasMetadataFor(value) {
        const Class = this._getClass(value);

        try {
            return !! Class && ReflectionClass.exists(Class);
        } catch (e) {
            return false;
        }
    }

    /**
     * Create a new instance of metadata object for this factory.
     *
     * @param {ReflectionClass} reflectionClass
     *
     * @returns {Jymfony.Component.Metadata.ClassMetadataInterface}
     *
     * @abstract
     * @protected
     */
    _createMetadata(reflectionClass) { // eslint-disable-line no-unused-vars
        throw new Error('Abstract _createMetadata must be implemented');
    }

    /**
     * Validate loaded metadata.
     * MUST throw {@see InvalidMetadataException} if validation error occurs.
     *
     * @param {Jymfony.Component.Metadata.ClassMetadataInterface} classMetadata
     *
     * @protected
     */
    _validate(classMetadata) { // eslint-disable-line no-unused-vars
        // Do nothing.
    }

    /**
     * Merges given metadata with the metadata to the metadata from superclass and
     * implemented interfaces.
     *
     * @param {Jymfony.Component.Metadata.ClassMetadataInterface} classMetadata
     *
     * @protected
     */
    _mergeSuperclasses(classMetadata) {
        const reflectionClass = classMetadata.reflectionClass;

        const parent = reflectionClass.getParentClass();
        if (!! parent && parent.getConstructor() !== __jymfony.JObject && ReflectionClass.exists(parent.name)) {
            classMetadata.merge(this.getMetadataFor(parent.name));
        }

        for (const IF of reflectionClass.interfaces) {
            classMetadata.merge(this.getMetadataFor(IF.name));
        }
    }

    /**
     * Gets the class name from a string or an object.
     *
     * @param {object|string} value
     *
     * @returns {string|boolean}
     *
     * @private
     */
    _getClass(value) {
        if (isFunction(value)) {
            try {
                return ReflectionClass.getClassName(value);
            } catch (e) {
                // Do nothing.
            }
        }

        if (! isObject(value) && ! isString(value)) {
            return false;
        }

        if (isObject(value)) {
            try {
                return ReflectionClass.getClassName(value);
            } catch (e) {
                return false;
            }
        }

        return value;
    }
}
