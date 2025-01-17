const MetadataHelper = require('../Metadata/MetadataHelper');
const ReflectorTrait = require('./ReflectorTrait');
const privateAccessors = new WeakMap();
const accessibleMap = new WeakMap();

class ReflectionField extends implementationOf(ReflectorInterface, ReflectorTrait) {

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
     * @type {boolean}
     *
     * @private
     */
    _private;

    /**
     * @type {boolean}
     *
     * @private
     */
    _static;

    /**
     * @type {string}
     *
     * @private
     */
    _docblock;

    constructor(reflectionClass, fieldName) {
        super();

        this._class = reflectionClass;

        const metadata = this._class._fields[fieldName];
        if (! metadata) {
            throw new ReflectionException('Unknown class field "' + fieldName + '\'');
        }

        privateAccessors.set(this, metadata.access);

        this._name = fieldName;
        this._private = metadata.private;
        accessibleMap.set(this, ! this._private);
        this._static = metadata.static;
        this._docblock = metadata.docblock || null;

        return Object.freeze(this);
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
     * Gets the field name.
     *
     * @returns {string}
     */
    get name() {
        return this._name;
    }

    /**
     * Gets if this field is static.
     *
     * @returns {boolean}
     */
    get isStatic() {
        return this._static;
    }

    /**
     * If this field is private.
     *
     * @returns {boolean}
     */
    get isPrivate() {
        return this._private;
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
     * Sets the accessible flag.
     * Must be set to true to use the field accessors.
     *
     * @param {boolean} val
     */
    set accessible(val) {
        accessibleMap.set(this, !! val);
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

        const target = MetadataHelper.getMetadataTarget({ kind: 'field', name: this._name, metadata });
        const storage = MetadataStorage.getMetadata(target);

        return [ ...(function * () {
            for (const [ class_, data ] of storage) {
                for (const datum of isArray(data) ? data : [ data ]) {
                    yield [ class_, datum ];
                }
            }
        }()) ];
    }

    /**
     * Gets the field current value.
     *
     * @param {*} object
     *
     * @returns {*}
     */
    getValue(object) {
        this._checkAccessible();
        if (null === object) {
            __assert(this.isStatic);
            object = this.reflectionClass.getConstructor();
        } else {
            __assert(!this.isStatic);
        }

        return privateAccessors.get(this).get.bind(object)();
    }

    /**
     * Sets the field current value.
     *
     * @param {*} object
     * @param {*} value
     */
    setValue(object, value) {
        this._checkAccessible();
        if (null === object) {
            __assert(this.isStatic);
            object = this.reflectionClass.getConstructor();
        } else {
            __assert(!this.isStatic);
        }

        privateAccessors.get(this).set.bind(object)(value);
    }

    /**
     * Checks if the field is accessible by accessors.
     *
     * @private
     */
    _checkAccessible() {
        if (! accessibleMap.get(this)) {
            throw new ReflectionException('Field ' + this._name + ' is not accessible');
        }
    }
}

module.exports = globalThis.ReflectionField = ReflectionField;
