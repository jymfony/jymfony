/**
 * @namespace Jymfony.PropertyAccess
 * @type {Jymfony.PropertyAccess.PropertyAccessorInterface}
 */
module.exports = class PropertyAccessorInterface extends Interface {
    /**
     * Returns a value at the end of a property path
     *
     * The method tries to find a getter method for each property in the path.
     * The getter must be camel-cased and should eventually start with `get`,
     * `is` or `has`. If no public getter is found, tries to access the property
     * directly
     *
     * If a property in the path is not found, an exception is thrown
     *
     * @function
     * @name PropertyAccessorInterface#getValue
     *
     * @param {*} object
     * @param {string|Jymfony.PropertyAccess.PropertyPathInterface} path
     *
     * @throws {Jymfony.PropertyAccess.Exception.AccessException} A property in the path is not found
     */

    /**
     * Sets a value at the end of a property path
     *
     * The method tries to find a getter method for each property in the path and
     * a public setter for the last one.
     * Same rules of getValues applies for the getters, while setter should be
     * eventually prefixed by `set`
     *
     * If a property in the path is not found, an exception is thrown
     *
     * @function
     * @name PropertyAccessorInterface#setValue
     *
     * @param {*} object
     * @param {*} value
     * @param {string|Jymfony.PropertyAccess.PropertyPathInterface} path
     *
     * @throws {Jymfony.PropertyAccess.Exception.AccessException} A property in the path is not found
     */
};
