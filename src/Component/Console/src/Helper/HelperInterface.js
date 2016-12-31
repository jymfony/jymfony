/**
 * @memberOf Jymfony.Console.Helper
 * @type HelperInterface
 *
 * @interface
 */
class HelperInterface {
    /**
     * Sets the helper set associated with this helper.
     *
     * @param {Jymfony.Console.Helper.HelperSet} helperSet A HelperSet instance
     */
    set helperSet(helperSet) { }

    /**
     * Gets the helper set associated with this helper.
     *
     * @returns {Jymfony.Console.Helper.HelperSet} A HelperSet instance
     */
    get helperSet() { }

    /**
     * Returns the canonical name of this helper.
     *
     * @returns {string} The canonical name
     */
    get name() { }
}

module.exports = getInterface(HelperInterface);
