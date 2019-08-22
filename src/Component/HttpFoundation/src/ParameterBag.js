/**
 * @memberOf Jymfony.Component.HttpFoundation
 */
export default class ParameterBag {
    /**
     * Constructor.
     *
     * @param {Object.<string, *>} [parameters = {}]
     */
    __construct(parameters = {}) {
        /**
         * @type {Object.<string, *>}
         *
         * @private
         */
        this._parameters = Object.assign({}, parameters);
    }

    /**
     * Gets a copy of the parameters collection.
     *
     * @returns {Object.<string, *>}
     */
    get all() {
        return Object.assign({}, this._parameters);
    }

    /**
     * Gets the parameters keys.
     *
     * @returns {string[]}
     */
    get keys() {
        return Object.keys(this._parameters);
    }

    /**
     * Adds/replaces parameters in the bag.
     *
     * @param {Object.<string, *>} parameters
     */
    add(parameters) {
        Object.assign(this._parameters, parameters);
    }

    /**
     * Gets a parameter or returns the default if the parameter is non existent.
     *
     * @param {string} key
     * @param {*} [defaultValue]
     *
     * @returns {*|undefined}
     */
    get(key, defaultValue = undefined) {
        return this.has(key) ? this._parameters[key] : defaultValue;
    }

    /**
     * Sets/overwrite a parameter in the bag.
     *
     * @param {string} key
     * @param {*} value
     */
    set(key, value) {
        this._parameters[key] = value;
    }

    /**
     * Checks whether a parameter is present in the bag.
     *
     * @param {string} key
     *
     * @returns {boolean}
     */
    has(key) {
        return this._parameters.hasOwnProperty(key);
    }

    /**
     * Deletes a parameter.
     *
     * @param {string} key
     */
    remove(key) {
        delete this._parameters[key];
    }

    /**
     * Gets a key/value iterator.
     *
     * @returns {Generator}
     */
    * [Symbol.iterator]() {
        yield * __jymfony.getEntries(this._parameters);
    }

    /**
     * Gets the number of elements in the bag.
     *
     * @returns {int}
     */
    get length() {
        return Object.keys(this._parameters).length;
    }
}
