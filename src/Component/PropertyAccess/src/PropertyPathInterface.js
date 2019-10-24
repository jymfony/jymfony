/**
 * @memberOf Jymfony.Component.PropertyAccess
 */
class PropertyPathInterface {
    /**
     * Returns the path as string.
     *
     * @returns {string}
     */
    toString() { }

    /**
     * Returns the element at given index.
     *
     * @param {int} index
     *
     * @returns {string}
     *
     * @throws {Jymfony.Component.PropertyAccess.Exception.OutOfBoundsException}
     */
    getElement(index) { }

    /**
     * Returns the elements of the property path as array.
     *
     * @returns {string[]} An array of property/index names
     */
    get elements() { }

    /**
     * Returns the path length.
     *
     * @returns {int}
     */
    get length() { }

    /**
     * Returns the parent property path.
     *
     * The parent property path is the one that contains the same items as
     * this one except for the last one.
     *
     * If this property path only contains one item, null is returned.
     *
     * @returns {Jymfony.Component.PropertyAccess.PropertyPathInterface|undefined} The parent path or null
     */
    get parent() { }

    /**
     * Returns a new iterator for this path.
     *
     * @returns {Jymfony.Component.PropertyAccess.PropertyPathIteratorInterface}
     */
    [Symbol.iterator]() { }

    /**
     * Returns whether the element at the given index is a property.
     *
     * @param {int} index The index in the property path
     *
     * @returns {boolean} Whether the element at this index is a property
     *
     * @throws {Jymfony.Component.PropertyAccess.Exception.OutOfBoundsException} If the offset is invalid
     */
    isProperty(index) { }

    /**
     * Returns whether the element at the given index is an array index.
     *
     * @param {int} index The index in the property path
     *
     * @returns {boolean} Whether the element at this index is an array index
     *
     * @throws {Jymfony.Component.PropertyAccess.Exception.OutOfBoundsException} If the offset is invalid
     */
    isIndex(index) { }

    /**
     * Returns the last element of the path.
     *
     * @returns {int}
     */
    get last() { }
}

export default getInterface(PropertyPathInterface);
