/**
 * @memberOf Jymfony.Contracts.HttpFoundation
 */
class ParameterBagInterface {
    /**
     * Gets a copy of the parameters collection.
     *
     * @returns {Object.<string, *>}
     */
    get all() { }

    /**
     * Gets the parameters keys.
     *
     * @returns {string[]}
     */
    get keys() { }

    /**
     * Adds/replaces parameters in the bag.
     *
     * @param {Object.<string, *>} parameters
     */
    add(parameters) { }

    /**
     * Gets a parameter or returns the default if the parameter is non existent.
     *
     * @param {string} key
     * @param {*} [defaultValue]
     *
     * @returns {*}
     */
    get(key, defaultValue) { }

    /**
     * Sets/overwrite a parameter in the bag.
     *
     * @param {string} key
     * @param {*} value
     */
    set(key, value) { }

    /**
     * Checks whether a parameter is present in the bag.
     *
     * @param {string} key
     *
     * @returns {boolean}
     */
    has(key) { }

    /**
     * Deletes a parameter.
     *
     * @param {string} key
     */
    remove(key) { }

    /**
     * Gets a key/value iterator.
     *
     * @returns {IterableIterator<[string, *]>}
     */
    [Symbol.iterator]() { }

    /**
     * Gets the number of elements in the bag.
     *
     * @returns {int}
     */
    get length() { }
}

export default getInterface(ParameterBagInterface);
