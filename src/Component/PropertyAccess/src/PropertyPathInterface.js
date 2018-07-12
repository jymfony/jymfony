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
     * Returns the path length.
     *
     * @returns {int}
     */
    get length() { }

    /**
     * Returns the last element of the path.
     *
     * @returns {int}
     */
    get last() { }
}

module.exports = getInterface(PropertyPathInterface);
