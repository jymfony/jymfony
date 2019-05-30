const privateAccessors = new WeakMap();

class ReflectionField {
    constructor(reflectionClass, fieldName) {
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
        this._name = fieldName;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._private = '#' === fieldName.substr(0, 1);

        /**
         * @type {boolean}
         *
         * @private
         */
        this._accessible = ! this._private;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._static = false;

        if (this._class._fields[fieldName]) {
            privateAccessors.set(this, this._class._fields[fieldName]);
        } else if (this._class._staticFields[fieldName]) {
            privateAccessors.set(this, this._class._staticFields[fieldName]);
            this._static = true;
        } else {
            throw new ReflectionException('Unknown class field "' + fieldName + '\'');
        }

        /**
         * @type {string}
         *
         * @private
         */
        this._docblock = reflectionClass._docblock ? reflectionClass._docblock.properties[(this._static ? 'static::' : '') + fieldName] : undefined;
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
        this._accessible = !! val;
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

        return privateAccessors.get(this).get(object);
    }

    /**
     * Sets the field current value.
     *
     * @param {*} object
     * @param {*} value
     */
    setValue(object, value) {
        this._checkAccessible();

        privateAccessors.get(this).set(object, value);
    }

    /**
     * Checks if the field is accessible by accessors.
     *
     * @private
     */
    _checkAccessible() {
        if (! this._accessible) {
            throw new ReflectionException('Field ' + this._name + ' is not accessible');
        }
    }
}

module.exports = ReflectionField;
