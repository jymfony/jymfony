/**
 * @namespace Jymfony.PropertyAccess
 * @type {Jymfony.PropertyAccess.PropertyPathInterface}
 */
module.exports = getInterface(class PropertyPathInterface {
    /**
     * Returns the path as string
     *
     * @function
     * @name PropertyPathInterface#toString
     *
     * @returns {string}
     */

    /**
     * Returns the element at given index
     *
     * @function
     * @name PropertyPathInterface#getElement
     *
     * @param {int} index
     *
     * @returns {string}
     *
     * @throws {Jymfony.PropertyAccess.Exception.OutOfBoundsException}
     */

    /**
     * Returns the path length
     *
     * @property
     * @readonly
     * @name PropertyPathInterface#length
     *
     * @returns {int}
     */

    /**
     * Returns the last element of the path
     *
     * @property
     * @readonly
     * @name PropertyPathInterface#last
     *
     * @returns {int}
     */
});
