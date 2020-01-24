const AttributeBagInterface = Jymfony.Component.HttpFoundation.Session.Attribute.AttributeBagInterface;

/**
 * This class relates to session attribute storage.
 *
 * @memberOf Jymfony.Component.HttpFoundation.Session.Attribute
 */
export default class AttributeBag extends implementationOf(AttributeBagInterface) {
    /**
     * Constructor.
     *
     * @param {string} storageKey The key used to store attributes in the session
     */
    __construct(storageKey = '_jf2_attributes') {
        /**
         * @type {string}
         *
         * @private
         */
        this._name = 'attributes';

        /**
         * @type {string}
         *
         * @private
         */
        this._storageKey = storageKey;

        /**
         * @type {Object.<string, any>}
         *
         * @private
         */
        this._attributes = {};
    }

    /**
     * @inheritdoc
     */
    get name() {
        return this._name;
    }

    /**
     * @inheritdoc
     */
    set name(name) {
        this._name = name;
    }

    /**
     * @inheritdoc
     */
    initialize(attributes) {
        this._attributes = attributes;
    }

    /**
     * @inheritdoc
     */
    get storageKey() {
        return this._storageKey;
    }

    /**
     * @inheritdoc
     */
    has(name) {
        return this._attributes.hasOwnProperty(name);
    }

    /**
     * @inheritdoc
     */
    get(name, defaultValue = null) {
        if (this.has(name)) {
            return this._attributes[name];
        }

        return defaultValue;
    }

    /**
     * @inheritdoc
     */
    set(name, value) {
        this._attributes[name] = value;
    }

    /**
     * @inheritdoc
     */
    all() {
        return { ...this._attributes };
    }

    /**
     * @inheritdoc
     */
    replace(attributes) {
        this._attributes = {};
        for (const [ key, value ] of __jymfony.getEntries(attributes)) {
            this.set(key, value);
        }
    }

    /**
     * @inheritdoc
     */
    remove(name) {
        const retval = this.get(name);
        delete this._attributes[name];

        return retval;
    }

    /**
     * @inheritdoc
     */
    clear() {
        const retVal = this._attributes;
        this._attributes = {};

        return retVal;
    }

    /**
     * Returns an iterator for attributes.
     *
     * @returns {IterableIterator.<string, any>} An iterator
     */
    [Symbol.iterator]() {
        return __jymfony.getEntries(this._attributes);
    }

    /**
     * Returns the number of attributes.
     *
     * @returns {int} The number of attributes
     */
    get length() {
        return Object.keys(this._attributes).length;
    }
}
