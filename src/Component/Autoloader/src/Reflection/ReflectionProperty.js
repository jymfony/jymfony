const MetadataHelper = require('../Metadata/MetadataHelper');
const ReflectorTrait = require('./ReflectorTrait');

/**
 * Reflection utility for class getters/setters.
 */
class ReflectionProperty extends implementationOf(ReflectorInterface, ReflectorTrait) {
    /**
     * @type {ReflectionClass}
     *
     * @private
     */
    _class;

    /**
     * @type {string}
     *
     * @private
     */
    _name;

    /**
     * @type {string}
     *
     * @private
     */
    _kind;

    /**
     * @type {Function}
     *
     * @private
     */
    _method;

    /**
     * @type {string}
     *
     * @private
     */
    _docblock;

    /**
     * Constructor.
     *
     * @param {ReflectionClass} reflectionClass
     * @param {string} kind
     * @param {string} propertyName
     */
    constructor(reflectionClass, kind, propertyName) {
        super();
        const descriptor = reflectionClass.getPropertyDescriptor(propertyName);

        this._class = new ReflectionClass(descriptor.ownClass);
        this._name = propertyName;
        this._kind = kind;

        if (ReflectionProperty.KIND_GET === kind && this._class.hasReadableProperty(propertyName)) {
            this._method = descriptor.get;
        } else if (ReflectionProperty.KIND_SET === kind && this._class.hasWritableProperty(propertyName)) {
            this._method = descriptor.set;
        }

        if (undefined === this._method) {
            throw new ReflectionException('Property "' + propertyName + '" (' + kind + ') does not exist');
        }

        this._docblock = this._method[Symbol.docblock];

        return Object.freeze(this);
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
        const metadata = this._class.getConstructor()[Symbol.metadata];
        if (undefined === metadata) {
            return [];
        }

        const target = MetadataHelper.getMetadataTarget({ kind: this._kind === ReflectionProperty.KIND_GET ? 'getter' : 'setter', name: this._name, metadata });
        const storage = MetadataStorage.getMetadata(target);

        return [ ...(function * () {
            for (const [ class_, data ] of storage) {
                for (const datum of isArray(data) ? data : [ data ]) {
                    yield [ class_, datum ];
                }
            }
        }()) ];
    }
}

ReflectionProperty.KIND_GET = 'get';
ReflectionProperty.KIND_SET = 'set';

module.exports = globalThis.ReflectionProperty = ReflectionProperty;
