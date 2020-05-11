const PropertyPathIteratorInterface = Jymfony.Contracts.PropertyAccess.PropertyPathIteratorInterface;

/**
 * Traverses a property path and provides additional methods to find out
 * information about the current element.
 *
 * @memberOf Jymfony.Component.PropertyAccess
 */
export class PropertyPathIterator extends implementationOf(PropertyPathIteratorInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Contracts.PropertyAccess.PropertyPathInterface} propertyPath
     */
    __construct(propertyPath) {
        /**
         * @type {string[]}
         *
         * @private
         */
        this._elements = propertyPath.elements;

        /**
         * @type {Jymfony.Contracts.PropertyAccess.PropertyPathInterface}
         *
         * @private
         */
        this._path = propertyPath;

        /**
         * @type {int}
         *
         * @private
         */
        this._index = 0;
    }

    /**
     * @inheritdoc
     */
    next() {
        return this._index < this._elements.length ?
            { value: this._elements[this._index++], done: false } :
            { value: null, done: true };
    }

    /**
     * Returns whether the current element in the property path is an array
     * index.
     *
     * @returns {boolean}
     */
    isIndex() {
        return this._path.isIndex(this._index);
    }

    /**
     * Returns whether the current element in the property path is a property
     * name.
     *
     * @returns {boolean}
     */
    isProperty() {
        return this._path.isProperty(this._index);
    }
}
