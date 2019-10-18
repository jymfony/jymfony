/**
 * @memberOf Jymfony.Contracts.HttpFoundation
 */
class HeaderBagInterface {
    /**
     * Returns the headers as a string.
     */
    toString() { }

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
     * @param {Object.<string, string | string[]>} parameters
     */
    add(parameters) { }

    /**
     * Gets a parameter or returns the default if the parameter is non existent.
     *
     * @param {string} key
     * @param {string|*} defaultValue
     * @param {boolean} first
     *
     * @returns {string | string[] | *}
     */
    get(key, defaultValue = undefined, first = true) { }

    /**
     * Sets/overwrite a parameter in the bag.
     *
     * @param {string} key
     * @param {string | string[]} values
     * @param {boolean} replace
     */
    set(key, values, replace = true) { }

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
     * @returns {IterableIterator<[string, string[]]>}
     */
    [Symbol.iterator]() { }

    /**
     * Gets the number of elements in the bag.
     *
     * @returns {int}
     */
    get length() { }

    /**
     * Gets the cookies in this bag.
     *
     * @returns {Object.<string, string>}
     */
    get cookies() { }

    /**
     * Adds a custom Cache-Control directive.
     *
     * @param {string} key The Cache-Control directive name
     * @param {boolean} [value] The Cache-Control directive value
     */
    addCacheControlDirective(key, value) { }

    /**
     * Returns true if the Cache-Control directive is defined.
     *
     * @param {string} key The Cache-Control directive
     *
     * @returns {boolean} true if the directive exists, false otherwise
     */
    hasCacheControlDirective(key) { }

    /**
     * Returns a Cache-Control directive value by name.
     *
     * @param {string} key The directive name
     *
     * @returns {*} The directive value if defined, undefined otherwise
     */
    getCacheControlDirective(key) { }

    /**
     * Removes a Cache-Control directive.
     *
     * @param {string} key The Cache-Control directive
     */
    removeCacheControlDirective(key) { }

    /**
     * Gets the cache control header
     *
     * @returns {string}
     */
    get cacheControlHeader() { }
}

export default getInterface(HeaderBagInterface);
